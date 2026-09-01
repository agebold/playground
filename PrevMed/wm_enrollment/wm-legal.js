/* ══════════════════════════════════════════════
   wm-legal.js — the two consent documents, transcribed from the board.

   Figma holds each of these as a SINGLE text node inside a 319px-tall scrolling
   Section, so only about six lines are ever visible at rest:
     HIPAA notice          2313:23752   (inside Section 2313:23747)
     New patient agreement 2313:23793   (inside Section 2313:23790)

   ABRIDGED, deliberately. Each node on the board carries the full document —
   roughly 15,000 and 20,000 characters. What is transcribed here is the verbatim
   opening of each, which is several screens' worth of scrolling and far more than
   the clip ever shows. The node ids above are the source for the rest.
   Recorded in FIDELITY.md so this is not mistaken for the complete text.
══════════════════════════════════════════════ */
window.WMLEGAL = {

  /* 2313:23752 */
  hipaa: [
    'The law requires us to maintain the privacy of certain health information ' +
    'called "Protected Health Information" or "PHI". Protected Health Information ' +
    'is the information that you provide us or that we create or receive about your ' +
    'health care. The law also requires us to provide you with this Notice of our ' +
    'legal duties and privacy practices. When we use or disclose (share) your ' +
    'Protected Health Information, we are required to follow the terms of this ' +
    'Notice or other notice in effect at the time we use or share the PHI. Finally, ' +
    'the law provides you with certain rights described in this Notice. Furthermore, ' +
    'we are required to notify you following a breach of unsecured PHI.',

    'This Notice describes the privacy practices of Practice. It applies to the ' +
    'health services you receive from the Practice. The Practice will be referred to ' +
    'herein as "we" or "us." We will share your health information among ourselves ' +
    'to carry out our treatment, payment, and health care operations.',

    'THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND SHARED ' +
    'AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.',

    'Ways We Can Use and Share Your PHI Without Your Written Permission ' +
    '(Authorization). In many situations, we can use and share your PHI for ' +
    'activities that are common in many hospitals and clinics. In certain other ' +
    'situations, which we will describe under "Uses and Disclosures Requiring Your ' +
    'Written Permission (Authorization)," we must have your written permission to ' +
    'use and/or share your PHI.',

    'Uses and Disclosures for Treatment, Payment and Health Care Operations. We may ' +
    'use and share your PHI to provide "Treatment," obtain "Payment" for your ' +
    'Treatment, and perform our "Health Care Operations."'
  ],

  /* 2313:23793 */
  care: [
    'Age Bold’s clinical care is provided by Mighty Health Medical Services of ' +
    'New Jersey, P.C.; Mighty Health Medical Services, P.A.; Bradley J. E. ' +
    'Professional Corporation, and New York City Health Medical, P.C. ' +
    '(“Provider Group”) and its contractual affiliates. Age Bold connects you ' +
    'to a Provider Group physician or nurse practitioner to provide medical care and ' +
    'treatment. Age Bold does not provide any medical services, does not practice ' +
    'medicine, and does not influence the practice of medicine or any licensed ' +
    'profession provided by Provider Group’s clinicians, each of whom are ' +
    'responsible for his or her services and compliance with the requirements ' +
    'applicable to his or her profession and license.',

    'This New Patient Agreement (the “Agreement”), effective as of the date ' +
    'of the Patient’s signature (the “Effective Date”), is made by and ' +
    'between Age Bold Provider Group, P.A., a Florida professional corporation and ' +
    'its contractual affiliates (“Practice”), and the undersigned patient ' +
    '(the “Patient,” “You” or “I” when making affirmative ' +
    'statements in this Agreement). You are a patient of the Practice who receives ' +
    'certain medical services from its clinicians using telehealth technologies ' +
    '(“Medical Services”).',

    'Term, Termination, and Cancellation. This Agreement will commence on the ' +
    'Effective Date and will extend until after the consult(s).',

    'Other Providers. You acknowledge that the signing of this Agreement is strictly ' +
    'voluntary. This Agreement does not restrict or limit your ability to receive ' +
    'professional services from other health care professionals.',

    'Insurance or Other Medical Coverage. This Agreement and the Practice’s ' +
    'provision of Medical Services are not substitutes for health insurance or other ' +
    'health plan coverage (such as membership in an HMO). You acknowledge that the ' +
    'Practice has advised You to obtain or keep in full force your health insurance ' +
    'policy(ies) or plans in order to cover You and your family members for Medical ' +
    'Services and other healthcare costs.'
  ]
};
