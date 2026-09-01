# Clinic No-Show Rates by Day of Week & Time of Day

First-party operational data — Bold Clinic / Bold Care appointments, Year-to-Date 2026, times in **PST**.
Source: *No Show Rates by DOW and Time* (PDF in this folder). Visit types pooled: Physician Virtual Visit
(+ Follow-Up), Provider Virtual Visit (+ Follow-Up), Weight Management Initial Visit (+ Follow-Up).

This is **internal analytics, not literature** — it reflects how *our* 65+ members actually behave, so it
outranks generic benchmarks for scheduling decisions. Use it to steer the appointment-scheduling step of the
clinic funnel ([PrevMed/clinic_funnel/04-schedule.html](PrevMed/clinic_funnel/04-schedule.html) and variants).

---

## The two robust patterns

### 1. Afternoon appointments no-show at ~2× the morning rate
Time-of-day no-show rate (all days pooled), lowest → highest:

| Time | No-show | | Time | No-show |
|------|---------|-|------|---------|
| 10am | ~8.5% (lowest) | | 12pm | ~16% |
| 9am  | ~9.7% | | 1pm  | ~17% |
| 11am | ~9.7% | | 2pm  | ~16% |
| 6am  | ~11.5% | | **3pm** | **~18% (highest)** |
| 7am  | ~11.9% | | | |
| 8am  | ~12.4% | | | |

Morning (esp. **9–11am**) is the safe window; there is a sharp step-up at **noon** that holds through 3pm.

### 2. Friday is the worst weekday; Monday is second
No-show rate by day of week (all times pooled):

| Day | No-show | n (appts) |
|-----|---------|-----------|
| **Friday** | **20.6%** | 63 |
| Monday | 15.6% | 186 |
| Thursday | 12.3% | 284 |
| Tuesday | 11.4% | 271 |
| Wednesday | 10.8% | 83 |

Weekday-only clinic (no weekend data). Blended rate ≈ **13%**.

### Worst specific slots (only cells with ≥10 appointments — ignore small-n noise)
| Slot | No-show | n |
|------|---------|---|
| Friday 12pm | 41.7% | 12 |
| Monday 12pm | 33.3% | 24 |
| Monday 7am | 29.4% | 17 |
| Monday 1pm | 28.0% | 25 |
| Thursday 3pm | 27.3% | 11 |
| Tuesday 2pm | 23.1% | 26 |
| Friday 2pm | 21.4% | 14 |
| Thursday 1pm | 18.2% | 33 |

**Safest robust cells:** mid-morning (9–11am) on Tue / Wed / Thu.

---

## How to apply this to clinic design

1. **Default and rank morning slots first.** In the scheduling step, surface **9–11am** slots at the top and
   pre-select a morning option. Today [04-schedule.html](PrevMed/clinic_funnel/04-schedule.html) lists 6am→5pm
   in raw chronological order with no risk weighting — reorder so low-no-show times lead.
2. **De-emphasize the danger cells.** Push **Friday** and **Monday/afternoon (12–3pm)** slots lower in the list,
   or trim their offered capacity. Don't lead a 65+ member into a Friday-noon slot that no-shows 4 in 10.
3. **Scale reminder intensity to slot risk.** For any booked **afternoon or Friday** appointment, add an extra
   confirmation touchpoint (SMS + Care Coordinator call) — those carry ~2× the no-show risk, and the CC call is
   already a required momentum step in the weight-management flow.
4. **Frame morning as the recommendation, warmly** — e.g. "Mornings work best for most members" — rather than
   hiding options (Principle 4: transparency; Principle 5: clarity/confidence).
5. **Ops lever (not UX):** buffer/overbook the highest-risk cells (Fri 12pm, Mon 12–1pm).

---

## Caveats — don't over-read
- **Pooled visit types.** The report does not split no-show by visit type × day/time; weight-management vs.
  physician visits may behave differently. Treat day/time as the signal, not visit type.
- **Small samples are noise.** Single-appointment cells show 0% or 100% — meaningless. Only the ≥10-appt table
  and the DOW/time-pooled rates above are reliable.
- **PST, YTD 2026, weekdays only.** Re-pull before treating as current if the visit mix shifts materially.
