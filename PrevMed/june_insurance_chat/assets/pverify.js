/* ==========================================================================
   pverify.js — eligibility adapter
   --------------------------------------------------------------------------
   Request and response field names mirror the real pVerify REST API so that
   swapping in live credentials is a flag flip, not a rewrite.

   Schema source of truth is pVerify's own Java client
   (github.com/pVerify/restapijava) — NOT the marketing pages, which stop at
   object level.

   Three facts about this vendor that the UI must respect:
     1. `IsHMOPlan` is the only explicit plan-type flag any vendor exposes.
        It drives the HMO-referral outcome.
     2. `IsPayerBackOffice` means the payer is NOT real-time (~24h turnaround).
        A same-session cost answer is not guaranteed for every carrier, so the
        flow needs a genuine "pending" terminal state.
     3. There is NO Medigap field. Supplemental coverage can only be inferred
        from `OtherPayerInfo.SecondaryPayer`. The UI must never claim to know it.
   ========================================================================== */

(function (global) {
  'use strict';

  /* ---- Request builder -------------------------------------------------- */

  /**
   * Build an EligibilitySummary request.
   * The brief's three lookup keys are all supported, which is what makes the
   * silent retry possible: we can re-query with name+DOB or with the SSN that
   * Verified already gave us, before asking the patient for anything.
   *
   * @param {object} o
   * @param {string} o.payerCode          pVerify payer code (e.g. '00007')
   * @param {string} o.payerName
   * @param {string} o.providerNpi
   * @param {string} o.providerLastName
   * @param {string} o.firstName
   * @param {string} o.lastName
   * @param {string} o.dob                MM/DD/YYYY
   * @param {string} [o.memberId]         the one new ask
   * @param {string} [o.ssn]              from Verified, when memberId is absent
   * @param {string} [o.serviceCode]      default '30' (health benefit plan coverage)
   * @param {string} [o.dateOfService]    MM/DD/YYYY
   */
  function buildEligibilityRequest(o) {
    return {
      payerCode: o.payerCode || '',
      payerName: o.payerName || '',
      provider: {
        lastName: o.providerLastName || 'Bold Health',
        npi: o.providerNpi || '',
      },
      subscriber: {
        firstName: o.firstName || '',
        lastName: o.lastName || '',
        dob: o.dob || '',
        // pVerify accepts memberID OR ssn as the lookup key
        memberID: o.memberId || '',
        ssn: o.ssn || '',
      },
      isSubscriberPatient: 'True',
      doS_StartDate: o.dateOfService || todayUS(),
      doS_EndDate: o.dateOfService || todayUS(),
      serviceCodes: o.serviceCode || '30',
      includeTextResponse: false,
      // which key we actually used — not part of the wire format, kept for the
      // Measures readout so we can tell a silent retry from a member-ID lookup
      _lookupKey: o.memberId ? 'memberId' : o.ssn ? 'ssn' : 'nameDob',
    };
  }

  function todayUS(d) {
    var t = d || new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    return p(t.getMonth() + 1) + '/' + p(t.getDate()) + '/' + t.getFullYear();
  }

  /* ---- Response fixtures ----------------------------------------------- */
  /* One fixture per outcome, in the real response shape, so the mock path and
     any future live path are read by exactly the same normalise() below. */

  var FIXTURES = {
    confirmed_zero: function (ctx) {
      return {
        APIResponseCode: '0',
        APIResponseMessage: 'Processed',
        IsPayerBackOffice: false,
        IsHMOPlan: false,
        PlanCoverageSummary: {
          Status: 'Active',
          PolicyType: 'Medicare Part B',
          EffectiveDate: '01/01/2026',
          PayerName: ctx.carrier || 'Medicare',
        },
        HBPC_Deductible_OOP_Summary: {
          IndividualDeductibleInNet: { Value: '$0.00' },
          IndividualDeductibleInNetRemaining: { Value: '$0.00' },
          IndividualOOP_InNetRemaining: { Value: '$0.00' },
        },
        MedicareInfoSummary: {
          AdvantagePayerName: '',
          // a normally-covered member HAS a pharmacy payer. Only the no_part_d
          // fixture leaves this empty — that emptiness is the whole signal.
          PharmacyPayerName: 'Medicare Part D',
        },
        OtherPayerInfo: { SecondaryPayer: '' },
        ServiceDetails: [
          { ServiceName: 'Telehealth', EligibilityDetails: [
            { CoPayment: '$0.00', CoInsurance: '0%', InNetwork: 'Yes' },
          ] },
        ],
      };
    },

    confirmed_cost: function (ctx) {
      return {
        APIResponseCode: '0',
        APIResponseMessage: 'Processed',
        IsPayerBackOffice: false,
        IsHMOPlan: false,
        PlanCoverageSummary: {
          Status: 'Active',
          PolicyType: 'Medicare Advantage PPO',
          EffectiveDate: '01/01/2026',
          PayerName: ctx.carrier || 'Aetna',
        },
        HBPC_Deductible_OOP_Summary: {
          IndividualDeductibleInNet: { Value: '$250.00' },
          IndividualDeductibleInNetRemaining: { Value: '$180.00' },
          IndividualOOP_InNetRemaining: { Value: '$1,200.00' },
        },
        MedicareInfoSummary: { AdvantagePayerName: ctx.carrier || 'Aetna', PharmacyPayerName: (ctx.carrier || 'Aetna') + ' Part D' },
        OtherPayerInfo: { SecondaryPayer: '' },
        ServiceDetails: [
          { ServiceName: 'Telehealth', EligibilityDetails: [
            { CoPayment: '$25.00', CoInsurance: '0%', InNetwork: 'Yes' },
          ] },
        ],
      };
    },

    not_found: function () {
      return {
        APIResponseCode: '5',
        APIResponseMessage: 'Subscriber/Insured Not Found',
        IsPayerBackOffice: false,
        IsHMOPlan: null,
        PlanCoverageSummary: null,
        HBPC_Deductible_OOP_Summary: null,
        MedicareInfoSummary: null,
        OtherPayerInfo: null,
        ServiceDetails: [],
      };
    },

    hmo_referral: function (ctx) {
      return {
        APIResponseCode: '0',
        APIResponseMessage: 'Processed',
        IsPayerBackOffice: false,
        IsHMOPlan: true,
        PlanCoverageSummary: {
          Status: 'Active',
          PolicyType: 'Medicare Advantage HMO',
          EffectiveDate: '01/01/2026',
          PayerName: ctx.carrier || 'Aetna',
        },
        HBPC_Deductible_OOP_Summary: {
          IndividualDeductibleInNetRemaining: { Value: '$0.00' },
        },
        MedicareInfoSummary: { AdvantagePayerName: ctx.carrier || 'Aetna', PharmacyPayerName: (ctx.carrier || 'Aetna') + ' Part D' },
        OtherPayerInfo: { SecondaryPayer: '' },
        ServiceDetails: [
          { ServiceName: 'Telehealth', EligibilityDetails: [
            { CoPayment: '$0.00', CoInsurance: '0%', InNetwork: 'Yes', ReferralRequired: 'Yes' },
          ] },
        ],
      };
    },

    not_covered: function (ctx) {
      return {
        APIResponseCode: '0',
        APIResponseMessage: 'Processed',
        IsPayerBackOffice: false,
        IsHMOPlan: false,
        PlanCoverageSummary: {
          Status: 'Active',
          PolicyType: 'Medicare Advantage PPO',
          EffectiveDate: '01/01/2026',
          PayerName: ctx.carrier || 'Humana',
        },
        HBPC_Deductible_OOP_Summary: null,
        MedicareInfoSummary: { AdvantagePayerName: ctx.carrier || 'Humana', PharmacyPayerName: (ctx.carrier || 'Humana') + ' Part D' },
        OtherPayerInfo: { SecondaryPayer: '' },
        ServiceDetails: [
          { ServiceName: 'Telehealth', EligibilityDetails: [
            { CoPayment: '', CoInsurance: '', InNetwork: 'No' },
          ] },
        ],
      };
    },

    pending_back_office: function (ctx) {
      return {
        APIResponseCode: '0',
        APIResponseMessage: 'Payer requires back office processing',
        // the honest case: pVerify is not synchronous for this payer
        IsPayerBackOffice: true,
        IsHMOPlan: null,
        PlanCoverageSummary: {
          Status: 'Pending',
          PolicyType: '',
          PayerName: ctx.carrier || 'Anthem',
        },
        HBPC_Deductible_OOP_Summary: null,
        MedicareInfoSummary: null,
        OtherPayerInfo: null,
        ServiceDetails: [],
      };
    },

    no_part_d: function (ctx) {
      return {
        APIResponseCode: '0',
        APIResponseMessage: 'Processed',
        IsPayerBackOffice: false,
        IsHMOPlan: false,
        PlanCoverageSummary: {
          Status: 'Active',
          PolicyType: 'Medicare Advantage PPO',
          EffectiveDate: '01/01/2026',
          PayerName: ctx.carrier || 'UnitedHealthcare',
        },
        HBPC_Deductible_OOP_Summary: {
          IndividualDeductibleInNetRemaining: { Value: '$0.00' },
        },
        MedicareInfoSummary: {
          AdvantagePayerName: ctx.carrier || 'UnitedHealthcare',
          // no pharmacy payer => no Part D route for a GLP-1
          PharmacyPayerName: '',
        },
        OtherPayerInfo: { SecondaryPayer: '' },
        ServiceDetails: [
          { ServiceName: 'Telehealth', EligibilityDetails: [
            { CoPayment: '$0.00', CoInsurance: '0%', InNetwork: 'Yes' },
          ] },
        ],
      };
    },
  };

  var SCENARIOS = [
    { id: 'confirmed_zero',      label: 'Confirmed — $0 out of pocket' },
    { id: 'confirmed_cost',      label: 'Confirmed — has a copay' },
    { id: 'not_found',           label: "Still can't find the member" },
    { id: 'hmo_referral',        label: 'HMO — referral needed' },
    { id: 'not_covered',         label: 'Plan not in network' },
    { id: 'pending_back_office', label: 'Pending — payer is back-office' },
    { id: 'no_part_d',           label: 'No Part D route for a GLP-1' },
  ];

  /* ---- Normalise ------------------------------------------------------- */
  /* The ONLY place the flow reads pVerify from. Mock and live both come
     through here, so the UI can never depend on fixture-only shapes. */

  function money(node) {
    if (!node) return null;
    var v = typeof node === 'string' ? node : node.Value;
    if (!v) return null;
    var n = Number(String(v).replace(/[$,]/g, ''));
    return isNaN(n) ? null : n;
  }

  function firstDetail(res) {
    var sd = (res && res.ServiceDetails) || [];
    for (var i = 0; i < sd.length; i++) {
      var ed = sd[i].EligibilityDetails || [];
      if (ed.length) return ed[0];
    }
    return {};
  }

  /**
   * Reduce a pVerify response to the small set of facts the conversation needs,
   * plus an `outcome` the flow can branch on. This function is the contract —
   * nothing downstream touches raw pVerify fields.
   */
  function normalize(res, ctx) {
    ctx = ctx || {};
    var detail = firstDetail(res);
    var summary = res.PlanCoverageSummary || {};
    var oop = res.HBPC_Deductible_OOP_Summary || {};
    var medicare = res.MedicareInfoSummary || {};
    var other = res.OtherPayerInfo || {};

    var notFound = String(res.APIResponseCode) !== '0' ||
                   /not found/i.test(res.APIResponseMessage || '');
    var backOffice = res.IsPayerBackOffice === true;
    var inNetwork = String(detail.InNetwork || '').toLowerCase() === 'yes';
    var copay = money(detail.CoPayment);
    var deductibleLeft = money(oop.IndividualDeductibleInNetRemaining);
    var coinsurance = parseFloat(String(detail.CoInsurance || '').replace('%', '')) || 0;

    var outcome;
    if (notFound)               outcome = 'not_found';
    else if (backOffice)        outcome = 'pending_back_office';
    else if (!inNetwork)        outcome = 'not_covered';
    else if (res.IsHMOPlan === true) outcome = 'hmo_referral';
    else if (ctx.wantsGlp1 && !medicare.PharmacyPayerName) outcome = 'no_part_d';
    else if ((copay || 0) === 0 && coinsurance === 0 && (deductibleLeft || 0) === 0) outcome = 'confirmed_zero';
    else                        outcome = 'confirmed_cost';

    return {
      outcome: outcome,
      carrier: summary.PayerName || medicare.AdvantagePayerName || ctx.carrier || '',
      policyType: summary.PolicyType || '',
      status: summary.Status || '',
      isHmo: res.IsHMOPlan === true,
      isBackOffice: backOffice,
      inNetwork: inNetwork,
      copay: copay,
      coinsurance: coinsurance,
      deductibleRemaining: deductibleLeft,
      // pVerify has no Medigap field — this is the closest signal and it is a
      // hint only. Never surfaced to the member as fact.
      secondaryPayerHint: other.SecondaryPayer || '',
      hasPartDRoute: Boolean(medicare.PharmacyPayerName),
      raw: res,
    };
  }

  /* ---- Verify ---------------------------------------------------------- */

  /**
   * Run an eligibility check.
   *
   * Live mode posts the request to the local proxy, which holds the pVerify
   * credentials server-side. Mock mode returns the fixture selected in the
   * Scenarios tab. Both return the same normalised shape.
   */
  async function verify(opts) {
    var req = buildEligibilityRequest(opts);
    var ctx = { carrier: opts.payerName, wantsGlp1: !!opts.wantsGlp1 };

    if (opts.live && opts.proxyUrl) {
      var ctrl = new AbortController();
      var t = setTimeout(function () { ctrl.abort(); }, opts.timeoutMs || 15000);
      try {
        var headers = { 'Content-Type': 'application/json' };
        // the deployed Worker requires this; the local dev proxy ignores it
        if (opts.proxySecret) headers['X-June-Key'] = opts.proxySecret;
        var r = await fetch(opts.proxyUrl.replace(/\/$/, '') + '/verify', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(req),
          signal: ctrl.signal,
        });
        clearTimeout(t);
        if (!r.ok) throw new Error('pVerify proxy returned ' + r.status);
        var live = await r.json();
        return { request: req, result: normalize(live, ctx), source: 'live' };
      } catch (err) {
        clearTimeout(t);
        // A failed lookup must never block the member — fall back to pending,
        // which routes to the coordinator rather than showing an error.
        return {
          request: req,
          result: normalize(FIXTURES.pending_back_office(ctx), ctx),
          source: 'live-failed',
          error: String(err && err.message || err),
        };
      }
    }

    var make = FIXTURES[opts.scenario] || FIXTURES.confirmed_zero;
    if (opts.latencyMs) await new Promise(function (r) { setTimeout(r, opts.latencyMs); });
    return { request: req, result: normalize(make(ctx), ctx), source: 'mock' };
  }

  global.PVerify = {
    SCENARIOS: SCENARIOS,
    FIXTURES: FIXTURES,
    buildEligibilityRequest: buildEligibilityRequest,
    normalize: normalize,
    verify: verify,
    todayUS: todayUS,
  };
})(window);
