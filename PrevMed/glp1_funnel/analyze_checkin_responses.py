#!/usr/bin/env python3
"""
Analyze GLP-1 onboarding check-in free-text responses.

Self-contained: the ONLY input is the Mixpanel export
    PrevMed/glp1_funnel/data/checkin-responses-2026-06-28_to_2026-07-28.csv
(columns: Date, Metric, responseText, <count for that day>).

What it does
------------
1. Repairs mojibake (UTF-8 that was misread as cp1252/latin-1, e.g. "donâ€™t").
2. Sums each distinct response string's daily counts across the whole window
   -> total submissions per string.
3. Tags each string with 0+ taxonomy tags via keyword/regex rules (MULTI-LABEL:
   a string can carry several tags, so tag %s intentionally sum to >100%).
4. Aggregates to "% of text answers" per tag, where the base = all non-blank
   submissions. Blank is reported separately as % of ALL answers.

Outputs (written next to this script)
-------------------------------------
- checkin-theme-share.csv        tag, group, total_mentions, pct_of_text_answers
- checkin-responses-tagged.csv   response, total_count, tags
- checkin-tag-examples.csv       tag, example_response, count   (top N per tag)
and a human-readable summary to stdout (incl. the UNMAPPED list, so rules can
be tightened until unmapped share is small).

stdlib only.
"""

import argparse
import csv
import os
import re
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CSV = os.path.join(HERE, "data", "checkin-responses-2026-06-28_to_2026-07-28.csv")

# ---------------------------------------------------------------------------
# Text normalization
# ---------------------------------------------------------------------------
_MOJIBAKE_MARKERS = ("Ã", "Â", "â€", "â", "€", "™", "\x9d", "\x9c")


def fix_mojibake(s):
    """Repair UTF-8 bytes that were decoded as cp1252/latin-1. Safe no-op on clean text."""
    if not s or not any(m in s for m in _MOJIBAKE_MARKERS):
        return s
    for enc in ("cp1252", "latin-1"):
        try:
            repaired = s.encode(enc).decode("utf-8")
            if repaired and repaired != s:
                return repaired
        except (UnicodeEncodeError, UnicodeDecodeError):
            continue
    return s


_WS = re.compile(r"\s+")


def normalize(s):
    s = fix_mojibake(s)
    s = s.replace("’", "'").replace("‘", "'")
    s = s.replace("“", '"').replace("”", '"')
    s = s.replace("—", "-").replace("–", "-")
    s = s.lower()
    s = _WS.sub(" ", s).strip()
    return s


# ---------------------------------------------------------------------------
# Taxonomy.  tag -> list of patterns.  A pattern is either a lowercase substring
# or a regex written as "re:<pattern>".  Multi-label by design.
# Groups: tier0 / desire / question / concern / segment (inferred from tag prefix).
# ---------------------------------------------------------------------------
NONANSWER = {
    "", "not sure", "no sure", "not sute", "i am not sute", "i am not sure",
    "dont know what to ask", "don't know what to ask", "dont know", "don't know",
    "nothing", "no", "none", "n/a", "na", "he", "my eng", "idk", "unsure",
    "not sure yet", ".", "?", "yes", "ok",
}

TAXONOMY = {
    # ---- A. DESIRES ----
    "desire.weight_loss": [
        "weight loss", "weightloss", "weight-loss", "wt loss", "wtloss",
        "lose weight", "loose weight", "losing weight", "loosing weight",
        "lose the weight", "loose the weight", "lose my weight", "lose about",
        "need to lose", "want to lose", "would like to lose", "help me lose",
        "help losing", "help loosing", "weight off", "get the weight off",
        "take the weight off", "take weight off", "get this weight off",
        "get weight off", "reduce weight", "weight reduction", "loss weight",
        "weight lose", "weight los", "overweight", "fat loss", "lose fat",
        "body fat", "goal weight", "healthy weight", "belly", "tummy", "waist",
        "stomach", "apron", "slim down", "trim", "lose", "loose ", "loosing",
        "losing", "weight", "weigh ", "lbs", "pound", "40 #", "shrink",
        "get rid of it", "get rid of", "rid of it",
        "re:\\blose\\b", "re:\\b\\d{1,3}\\s*(?:lb|lbs|pound|pounds|#)\\b",
    ],
    "desire.specific_target": [
        "re:\\b\\d{1,3}\\s*(?:lb|lbs|pound|pounds|#|ibs)\\b",
        "re:\\blose\\s+\\d", "re:\\bloose\\s+\\d", "re:\\bdrop\\s+\\d",
        "goal weight", "goal of 170", "down to 240", "down to 90", "to 125 pounds",
        "12% of my weight", "12 more", "reaching my goal", "reach my goal",
    ],
    "desire.belly": ["belly", "tummy", "waist", "stomach", "apron", "gut ", "midsection"],
    "desire.maintenance": [
        "keep it off", "keep the weight off", "keep weight off", "keeping it off",
        "keeping off", "keep off", "keeping the weight off", "keeping weight off",
        "not gain it back", "gain it back", "gaining it back", "gain the weight back",
        "gain back", "don't gain", "dont gain", "not regain", "maintain", "maintaining",
        "maintenance", "maintenace", "maintence", "sustain", "sustainable", "for life",
        "keep from gaining", "lifelong", "long term weight", "off and keep",
        "lose and keep", "lose it and keep", "not feeling deprived", "keep the pounds off",
    ],
    "desire.energy": [
        "energy", "fatigue", "fatigued", "fatiga", "tired", "tiredness", "exhaust",
        "stamina", "sluggish", "lethargic", "ambition", "vitality", "worn out",
        "no energy", "low energy", "more energy", "sleep all the time", "lagging",
    ],
    "desire.pain_mobility": [
        "pain", "arthrit", "joint", "knee", "hip ", "hips", "back pain", "lower back",
        "my back", "with my back", "leg pain", "legs", "sciatic", "osteo", "fibro",
        "lupus", "spine", "spinal", "mobility", "mobile", "walk", "walking",
        "move around", "get around", "standing", "stand ", "posture", "bent-over",
        "bent over", "wheelchair", "walker", "stiffness", "stiff", "ache", "achesx",
        "balance", "fall", "knee replacement", "hip replacement", "surgery", "flexib",
    ],
    "desire.appearance": [
        "feel good about myself", "feel better about myself", "feel good", "about myself",
        "confidence", "confident", "grandkid", "grandchild", "look better", "looking",
        "live longer", "longevity", "anti aging", "anti-aging", "younger", "loose skin",
        "skin tightening", "skin", "tone", "toning", "firm up", "firm", "enjoy my",
        "have a life", "quality of life", "uncomfortable", "feel better about",
    ],
    "desire.muscle_strength": [
        "muscle", "strength", "strengthen", "stronger", "strong", "lean mass", "lean",
        "bone density", "bone", "resistance", "sarcopenia", "build muscle",
        "preserve muscle", "without muscle", "muscle loss", "keep up strength",
        "regain the strength", "physically stronger",
    ],
    "desire.disease_control": [
        "diabet", "a1c", "blood sugar", "prediabet", "pre diabet", "pre-diabet",
        "cholesterol", "blood pressure", "hypertension", "high bp", " bp", "sleep apnea",
        "apnea", "inflammation", "fatty liver", "cirrhosis", "kidney", "ckd",
        "triglyceride", "copd", "chf", "heart", "cardiac", "stroke", "cancer", "thyroid",
        "hashimoto", "hormone", "hormonal", "menopaus", "metabolic", "metabolism",
        "reverse liver", "sleep apena", "hrt",
    ],
    "desire.plan_guidance": [
        "meal plan", "meal plans", "menu", "menus", "what to eat", "what and when to eat",
        "when to eat", "diet plan", "eating plan", "healthy diet", "nutrition", "recipe",
        "best foods", "food choices", "what i can eat", "how to eat", "learn to eat",
        "learning what to eat", "portion", "protein", "hi protein", "balanced eating",
        "eating healthy", "eat healthier", "healthy eating", "eating better",
        "best exercises", "which exercise", "workout", "exercise", "physical activity",
        "incorporating activity", "gym", "pilates", "treadmill", "resistance exercise",
        "motivation", "motivated", "accountability", "guidance", "coach", "diet",
        "exercis", "eating and exercising", "eating healthier", "what and when", "food",
    ],
    "desire.appetite_control": [
        "food noise", "craving", "crave", "hunger", "hungry", "appetite", "snack",
        "snacking", "binge", "overeat", "over eat", "over-eat", "emotional eating",
        "emotional over-eating", "stop eating", "eating at night", "night eating",
        "late pm cravings", "midnight snack", "sweet", "sweets", "sugar", "food junkie",
        "eat less", "feel full", "control my eating", "control snacking",
        "addicted to sugar", "sugar addiction", "i keep eating", "always hungry",
        "stop the food", "control of my eating", "control my eating", "eat all the time",
        "eating under control", "under control",
    ],
    "desire.medication_interest": [
        "glp", "ozempic", "wegovy", "wagovy", "wygovy", "zepbound", "mounjaro",
        "semaglutide", "tirzep", "terzep", "trizep", "saxenda", "foundayo", "the drug",
        "the drugs", "prescription", "weight loss med", "weightloss med",
        "weight loss medication", "medication to lo", "med to lose", "take wagovy",
        "take wegovy", "equals results like the drug", "a pill for weight", "the pill",
    ],
    "desire.general_health": [
        "get healthy", "healthier lifestyle", "living a healthier", "health all over",
        "things to do to be healthy", "overall health", "be healthy", "healthy living",
        "healthy aging", "live healthier", "healthy asian", "get in shape", "wellness",
        "prevention", "prevent", "keeping healthy",
    ],
    # ---- B. QUESTIONS ----
    "question.how_it_works": [
        "how does it work", "how does this work", "how do this work", "how the drug works",
        "how the weight loss medication works", "how it works", "how this works",
        "why this works", "what does the medicine", "what does the med", "what does it do",
        "what is your medication", "what is the medication", "what medication",
        "what is bold", "how the medicine", "what is this", "how it affects",
        "how this affects", "how will this effect", "how will this affect", "what to expect",
        "general information concerning this medicine", "all about the medicine",
    ],
    "question.cost_coverage": [
        "cost", "costs", "price", "pricing", "afford", "affordable", "copay", "co-pay",
        "co pay", "cheap", "cheaper", "expensive", "how much", "out of pocket",
        "out-of-pocket", "insurance", "medicare", "medicaid", "coverage", "covered",
        "cover it", "cover this", "cover me", "will they cover", "tricare", "part d",
        "part b", "uhc", "unitedhealth", "united health", "express scripts", "payment",
        "payments", "pay for", "won't pay", "wont pay", "free", "$", "dollar",
        "a month", "monthly", "per month", "50.00", "325", "1000",
    ],
    "question.eligibility": [
        "qualify", "qualifies", "qualification", "eligible", "eligibility", "candidate",
        "can i get on", "can i get the", "do i qualify", "am i able", "approved for",
        "get on the glp", "get on glp", "getting on glp", "join the program",
        "if i can get", "if i qualify", "am i a candidate",
    ],
    "question.safety": [
        "is it safe", "how safe", "safety", "safe to take", "safe for me", "is this safe",
        "safe?", "approved", "fda", "risk", "risks", "risky", "dangerous", "danger",
        "harmful", "legit", "legitimate", "thrown together", "skeleton face",
        "want something safe", "something safe",
    ],
    "question.side_effects": [
        "side effect", "side effects", "side affect", "side affects", "sided effect",
        "side-effect", "nausea", "nauseous", "nauseated", "throwing up", "throw up",
        "vomit", "hair loss", "hair lose", "losing hair", "skeleton face", "constipation",
        "constapation", "diarrhea", "stomach upset", "reaction", "effects", "will it cause",
        "cause nausea",
    ],
    "question.modality": [
        "pill", "pills", "oral", "tablet", "injection", "injections", "injectable", "shot",
        "shots", "inject", "needle", "needles", "syringe", "vial",
    ],
    "question.duration": [
        "forever", "how long", "long term", "long-term", "indefinite", "rest of my life",
        "for life", "for the rest", "stay on it", "stop taking", "go off", "come back after",
        "after i go off", "after i stop", "once i stop", "when i stop", "off the med",
        "off it", "off of it", "how long to lose", "on it forever",
    ],
    "question.interactions": [
        "with my medication", "with all my medication", "with my meds", "with all my meds",
        "allowed to take", "take with", "interfere", "interact", "along with my", "letrozole",
        "parkinson", "my other med", "current medication", "contraindic", "with cirrhosis",
        "with all my medications", "estradiol", "testosterone", "armour thyroid",
        "take it with", "with my condition",
    ],
    # ---- C. CONCERNS / BARRIERS ----
    "concern.affordability": [
        "can't afford", "cant afford", "cannot afford", "too expensive", "won't pay",
        "wont pay", "doesn't cover", "does not cover", "didn't cover", "did not cover",
        "no longer cover", "stopped covering", "quit covering", "quitcovering",
        "lost coverage", "lack of coverage", "insurance quit", "afford it",
        "afford with my medicare", "too much money", "not covered", "cheaper price",
        "for a cheaper", "became too expensive", "325", "1000.", "can i afford",
    ],
    "concern.plateau_switcher": [
        "stalled", "plateau", "plateaued", "not working", "no longer working",
        "isn't working", "not losing", "havent lost", "haven't lost", "not moving",
        "won't move", "wont move", "scale won't move", "stuck", "too slow", "very slow",
        "slow losing", "slowly losing", "not much success", "not much sucess",
        "dosage has only changed", "only changed once", "difficult to communicate",
        "communicate with the provider", "no results", "move the needle", "still hungry",
        "still taking the glp", "compound glp1 is no longer", "advancement on the shots",
        "havent lost weight", "haven't lost any weight", "scale move", "make the scale",
    ],
    "concern.side_effect_fear": [
        "skeleton face", "loose skin", "hair loss", "hair lose", "losing hair",
        "without muscle", "muscle loss", "afraid", "scared", "nervous", "worried",
        "don't want to feel", "dont want to feel", "feel nauseous or down", "make me feel",
        "feel bad", "hesitant", "without hair loss",
    ],
    "concern.comorbidity_safety": [
        "parkinson", "cancer", "cirrhosis", "ckd", "kidney", "dialysis", "thyroid",
        "hashimoto", "hernia", "copd", "chf", "heart failure", "congestive", "lupus",
        "fibromyalgia", "letrozole", "armour thyroid", "no thyroid", "stage 3", "hiatal",
        "colon", "gastro", "asthma", "inhaled steroid", "cancer medication",
        "all my medications", "several parkinson", "rare spinal",
    ],
    "concern.injection_aversion": [
        "afraid of shots", "scared of shots", "scared of the shot", "can't take injectable",
        "cant take injectable", "cannot take injectable", "no needles", "hate needles",
        "afraid of needles", "allergic reaction", "eczema", "scared of the glp",
    ],
    "concern.tried_everything": [
        "no matter what i try", "no matter what", "tried everything", "always gain it back",
        "gain it back", "yo yo", "yo-yo", "self sabotage", "self sabatoge", "can't lose",
        "cant lose", "cannot lose", "can't loose", "cant loose", "why can't i", "why i can't",
        "why i cant", "why cant i", "why i don't loose", "why i dont loose", "slow looser",
        "slow loser", "nothing works", "frustrat", "despite", "weight watchers", "atkins",
        "atkinson", "noom", "keto", "intermittent fasting", "struggle", "struggling",
        "been trying", "former failures",
    ],
    "concern.age": [
        "at my age", "my age", "old age", "at this age", "for my age", "yr old", "yrs old",
        "years old", "year-old", "year old", "turned 70", "i'm 69", "im 69", "i am 80",
        "age 80", "getting older", "grow older", "re:\\baging\\b",
    ],
    "concern.skepticism_trust": [
        "made up", "thrown together", "for $$$", "$$$", "what's in it for you",
        "whats in it for you", "why am i doing this through you", "scam", "gimmick", "legit",
        "is this real", "really work", "actually work", "not just something",
    ],
    # ---- SEGMENTS (inferred lifecycle relationship to GLP-1) ----
    "segment.current_glp1": [
        "currently on", "already on", "still taking the glp", "still on", "on tirzep",
        "on semaglutide", "on wegovy", "on zepbound", "on ozempic", "on mounjaro", "on a glp",
        "i take a glp", "take a glp", "on 12.5 zepbound", "on trizeptide", "taking glp",
        "taking a glp", "on the glp", "on compound", "im plateau on semaglutide",
        "getting close to my weight goal",
    ],
    "segment.lapsed": [
        "was taking", "had to discontinue", "discontinue due", "went off", "stopped taking",
        "stopped due", "didn't cover me any more", "go back on", "getting back on",
        "back on zepbound", "was up to", "used to take", "previously on", "took terzepitide",
        "i took terzepitide", "quit at", "had to stop",
    ],
    "segment.naive_curious": [
        "scared of the glp", "never tried", "never been on", "haven't tried", "thinking about",
        "considering", "curious", "willing to try the pill", "would like to try weight loss",
        "i'd like to try", "want to try", "interested in trying", "how do i start",
        "get started", "try the pill",
    ],
    "segment.maintenance_phase": [
        "lost 60 lbs", "lost almost 80", "lost 64 pounds", "lost 30 pounds", "lost 35",
        "already lost", "have lost", "i've lost", "ive lost", "after i lost",
        "reached my goal", "close to my weight goal", "maintain after", "down to 215",
        "lost 180lb", "lost 10 pounds but", "lost a", "80 pounds, want to continue",
    ],
    "segment.modest_goal": [
        "re:\\b(?:5|8|10|12|15|20)\\s*(?:lb|lbs|pound|pounds|ibs)\\b", "8-10", "8 to 10",
        "10-12", "few pounds", "just a few", "couple pounds", "last 10", "last 15",
        "only want to lose 20", "a few pounds",
    ],
}

GROUP_LABEL = {
    "tier0": "Tier 0 (low-signal)",
    "desire": "A. Desires",
    "question": "B. Questions",
    "concern": "C. Concerns",
    "segment": "Segments",
}


def compile_rules(taxonomy):
    compiled = {}
    for tag, pats in taxonomy.items():
        subs, res = [], []
        for p in pats:
            if p.startswith("re:"):
                res.append(re.compile(p[3:]))
            else:
                subs.append(p)
        compiled[tag] = (subs, res)
    return compiled


# Negation guard for desire.medication_interest.  The drug-name keywords match on any
# *mention* of a GLP-1, so a bare substring hit over-counts people who name a drug only to
# reject it ("without a GLP1"), refuse it ("can't take injectable"), or report an adverse
# reaction ("allergic reaction").  If a response carries one of these aversion markers AND no
# positive-want marker, we strip the desire tag (the response is still caught by the relevant
# concern./question. tags).  A positive marker (e.g. "willing to try", "get back on") overrides,
# so genuinely mixed answers like "scared of the shot but willing to try the pill" stay counted.
MED_AVERSION = [
    "without using a glp", "without a glp", "without glp",
    "do not want", "don't want", "dont want",
    "can't take", "cannot take", "can not take", "cant take",
    "allergic reaction", "scared of the glp", "scared of glp",
    "afraid of the glp", "afraid of glp",
]
MED_WANT = [
    "willing to try", "would like to", "i'd like to", "id like to", "want to try",
    "like to try", "want an effective", "get back on", "getting back on", "go back on",
    "get on the glp", "getting on glp", "want to get on", "prescribed", "to get my",
]


def tags_for(norm, compiled):
    hits = []
    for tag, (subs, res) in compiled.items():
        if any(s in norm for s in subs) or any(r.search(norm) for r in res):
            hits.append(tag)
    if "desire.medication_interest" in hits:
        if any(n in norm for n in MED_AVERSION) and not any(p in norm for p in MED_WANT):
            hits.remove("desire.medication_interest")
    return hits


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--csv", default=DEFAULT_CSV, help="path to the export CSV")
    ap.add_argument("--examples", type=int, default=8, help="example strings per tag")
    args = ap.parse_args()

    if not os.path.exists(args.csv):
        sys.exit("CSV not found: %s\n(Save the export there first — see the plan step 0.)" % args.csv)

    # 1-2. read + sum counts per distinct (mojibake-fixed) response string
    totals = defaultdict(int)  # fixed_response -> summed daily uniques
    with open(args.csv, "r", encoding="utf-8", newline="") as fh:
        reader = csv.reader(fh)
        header = next(reader, None)
        for row in reader:
            if len(row) < 4:
                continue
            if row[0] == "Date":
                continue
            resp = fix_mojibake(row[2])
            try:
                n = int((row[3] or "0").strip() or "0")
            except ValueError:
                n = 0
            totals[resp] += n

    all_answers = sum(totals.values())
    blank_total = sum(c for r, c in totals.items() if normalize(r) == "")
    nonanswer_total = sum(c for r, c in totals.items() if normalize(r) in NONANSWER and normalize(r) != "")
    text_base = all_answers - blank_total  # all non-blank submissions

    # 3. tag every non-blank, non-nonanswer string
    compiled = compile_rules(TAXONOMY)
    tag_mentions = defaultdict(int)
    tag_examples = defaultdict(list)       # tag -> [(count, response)]
    tagged_rows = []                        # (response, count, tags)
    unmapped = []                           # (count, response)
    group_union = defaultdict(int)          # group -> summed counts of any tag in group

    for resp, count in totals.items():
        norm = normalize(resp)
        if norm == "":
            tagged_rows.append((resp, count, ["tier0.blank"]))
            continue
        if norm in NONANSWER:
            tag_mentions["tier0.nonanswer"] += count
            tag_examples["tier0.nonanswer"].append((count, resp))
            tagged_rows.append((resp, count, ["tier0.nonanswer"]))
            continue
        hits = tags_for(norm, compiled)
        if not hits:
            unmapped.append((count, resp))
            tagged_rows.append((resp, count, ["unmapped"]))
            continue
        for t in hits:
            tag_mentions[t] += count
            tag_examples[t].append((count, resp))
        for g in {t.split(".")[0] for t in hits}:
            group_union[g] += count
        tagged_rows.append((resp, count, hits))

    unmapped_total = sum(c for c, _ in unmapped)

    # ---- write outputs ----
    share_path = os.path.join(HERE, "checkin-theme-share.csv")
    with open(share_path, "w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["tag", "group", "total_mentions", "pct_of_text_answers"])
        for tag in sorted(tag_mentions, key=lambda t: (-tag_mentions[t], t)):
            grp = tag.split(".")[0]
            pct = 100.0 * tag_mentions[tag] / text_base if text_base else 0.0
            w.writerow([tag, grp, tag_mentions[tag], "%.1f" % pct])

    tagged_path = os.path.join(HERE, "checkin-responses-tagged.csv")
    with open(tagged_path, "w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["response", "total_count", "tags"])
        for resp, count, tags in sorted(tagged_rows, key=lambda x: -x[1]):
            w.writerow([resp, count, ";".join(tags)])

    ex_path = os.path.join(HERE, "checkin-tag-examples.csv")
    with open(ex_path, "w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["tag", "example_response", "count"])
        for tag in sorted(tag_examples):
            for count, resp in sorted(tag_examples[tag], reverse=True)[: args.examples]:
                w.writerow([tag, resp, count])

    # ---- stdout summary ----
    def pct_text(n):
        return 100.0 * n / text_base if text_base else 0.0

    print("=" * 72)
    print("CHECK-IN INTENT ANALYSIS")
    print("=" * 72)
    print("Distinct response strings : %d" % len(totals))
    print("ALL submissions (incl blank): %d" % all_answers)
    print("  blank                    : %d  (%.1f%% of ALL)" % (blank_total, 100.0 * blank_total / all_answers if all_answers else 0))
    print("TEXT answers (base)        : %d" % text_base)
    print("  non-answer (not sure/no) : %d  (%.1f%% of text)" % (nonanswer_total, pct_text(nonanswer_total)))
    print("  unmapped                 : %d  (%.1f%% of text)" % (unmapped_total, pct_text(unmapped_total)))
    print()
    print("Top-level union (share of TEXT answers with >=1 tag in group):")
    for g in ("desire", "question", "concern", "segment"):
        print("  %-9s %6.1f%%" % (g, pct_text(group_union[g])))
    print()
    for g in ("desire", "question", "concern", "segment", "tier0"):
        rows = [(t, tag_mentions[t]) for t in tag_mentions if t.split(".")[0] == g]
        if not rows:
            continue
        print("-" * 60)
        print(GROUP_LABEL.get(g, g))
        for tag, n in sorted(rows, key=lambda x: -x[1]):
            print("  %-34s %6d  %5.1f%%" % (tag, n, pct_text(n)))
    print()
    print("-" * 60)
    print("UNMAPPED (top 40 by count) -- tighten rules if this list is rich:")
    for count, resp in sorted(unmapped, reverse=True)[:40]:
        print("  %4d  %s" % (count, resp[:90]))
    print()
    print("Wrote:\n  %s\n  %s\n  %s" % (share_path, tagged_path, ex_path))


if __name__ == "__main__":
    main()
