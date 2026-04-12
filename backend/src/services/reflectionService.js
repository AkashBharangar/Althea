/**
 * Observational reflections only — no advice, suggestions, or diagnosis.
 * Seven template families; selection uses negative share, trigger frequency, and score variation.
 */

/** @typedef {{ word: string, count: number }} TriggerRank */

const MIN_REFLECTIONS = 5;
const MAX_REFLECTIONS = 7;

/**
 * Seven reflection templates (IDs T1–T7). Wording stays descriptive and third-person / text-focused.
 */
export const REFLECTION_TEMPLATES = {
  /** T1 — % negative ≈ 0 */
  T1_NEG_EVEN:
    "There are moments where the tone stays fairly even on the page — none of these lines register as net-negative under the lexicon used here.",

  /** T2 — some but not most sentences negative */
  T2_NEG_POCKETS:
    "There are moments where the tone feels heavier — a portion of the sentences carry more negative-tinted words than the rest, side by side in the same passage.",

  /** T3 — many sentences negative */
  T3_NEG_SUSTAINED:
    "Much of this excerpt leans toward heavier word choices line after line — as the tally reads it, not as a label on anyone reading it.",

  /**
   * T4 — nouns co-occur with lexicon-heavy lines (clustered vs sparse wording).
   * @param {string} topics formatted list
   * @param {boolean} clustered repeated / dominant in that slice
   */
  T4_TOPICS_IN_HEAVY_SECTIONS: (topics, clustered) =>
    clustered
      ? `Certain topics appear more often during the sections that register heavier — here, words like ${topics} surface again near those lines.`
      : `Certain topics appear in the lines that register heavier — in this snippet: ${topics}.`,

  /** T5 — heavier lines without clear repeating nouns in this pass */
  T5_TRIGGERS_DIFFUSE:
    "Where the wording turns heavier, the nouns stay thin or scattered in this pass — little repeats for the tool to hang a pattern on.",

  /** T6 — scores swing */
  T6_SENTIMENT_SWINGS:
    "The sentiment scores move quite a bit from sentence to sentence — the language shifts tone more than it holds one steady pitch.",

  /** T7 — scores flat */
  T7_SENTIMENT_STEADY:
    "The scores stay in a narrow band across sentences — the wording’s tint is relatively steady through this excerpt.",
};

const PAD_OBSERVATIONS = [
  "This pass only sees lexicon matches; irony, names, and what happened off the page stay outside its view.",
  "Each sentence is weighed on its own here — order is noticed only for simple start-to-end comparison, not as a narrative verdict.",
  "Nothing here measures whether the writing is fair, kind, or proportionate — only how these particular words score in a small list.",
];

const BOUNDARY =
  "This is a mirror on words, not on a person. It cannot infer intent, context, or what would help — only patterns visible in the text.";

function mean(values) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdevPop(values) {
  if (values.length < 2) return 0;
  const m = mean(values);
  const v =
    values.reduce((s, x) => s + (x - m) * (x - m), 0) / values.length;
  return Math.sqrt(v);
}

/**
 * @param {{
 *   sentenceCount: number,
 *   negativeCount: number,
 *   avgScore: number,
 *   triggers: string[],
 *   triggerRanks?: TriggerRank[],
 *   timeline: { sentence: string, score: number, index: number }[],
 * }} ctx
 */
function computeMetrics(ctx) {
  const {
    sentenceCount,
    negativeCount,
    triggers,
    triggerRanks = [],
    timeline,
  } = ctx;

  const negPct = sentenceCount > 0 ? negativeCount / sentenceCount : 0;
  const scores = timeline.map((t) => t.score);
  const spread =
    scores.length > 0 ? Math.max(...scores) - Math.min(...scores) : 0;
  const st = stdevPop(scores);

  const top = triggerRanks[0];
  const second = triggerRanks[1];
  const topCount = top?.count ?? 0;
  const secondCount = second?.count ?? 0;
  const totalTriggerHits = triggerRanks.reduce((s, r) => s + r.count, 0);
  const distinctTriggers = triggerRanks.length;

  const shareTop =
    totalTriggerHits > 0 ? topCount / totalTriggerHits : 0;

  const triggersClustered =
    negativeCount > 0 &&
    distinctTriggers > 0 &&
    (topCount >= 2 ||
      shareTop >= 0.45 ||
      (topCount >= secondCount + 1 && topCount >= 2));

  const triggersDiffuse =
    negativeCount > 0 && distinctTriggers === 0;

  const volatile =
    sentenceCount >= 3 && (st >= 1.15 || spread >= 3);
  const steady =
    sentenceCount >= 3 && st < 0.95 && spread <= 2;

  return {
    sentenceCount,
    negativeCount,
    negPct,
    spread,
    stdev: st,
    triggers,
    triggerRanks,
    topCount,
    distinctTriggers,
    triggersClustered,
    triggersDiffuse,
    volatile,
    steady,
  };
}

function formatTopicList(triggers, max = 4) {
  const parts = triggers.slice(0, max);
  if (parts.length === 0) return "";
  if (parts.length === 1) return `“${parts[0]}”`;
  if (parts.length === 2) return `“${parts[0]}” and “${parts[1]}”`;
  return `${parts
    .slice(0, -1)
    .map((w) => `“${w}”`)
    .join(", ")}, and “${parts[parts.length - 1]}”`;
}

/**
 * Pick exactly one of T1–T3 from negative share.
 * @param {ReturnType<typeof computeMetrics>} m
 */
function selectNegTemplate(m) {
  if (m.sentenceCount === 0) {
    return "There is no text here yet — nothing for the lexicon to echo back.";
  }
  if (m.negPct === 0) return REFLECTION_TEMPLATES.T1_NEG_EVEN;
  if (m.negPct < 0.5) return REFLECTION_TEMPLATES.T2_NEG_POCKETS;
  return REFLECTION_TEMPLATES.T3_NEG_SUSTAINED;
}

/**
 * Pick at most one of T4–T5 from trigger frequency shape.
 * @param {ReturnType<typeof computeMetrics>} m
 */
function selectTriggerTemplate(m) {
  if (m.negativeCount === 0) return null;

  if (m.triggersDiffuse) {
    return REFLECTION_TEMPLATES.T5_TRIGGERS_DIFFUSE;
  }

  if (m.triggers.length > 0) {
    return REFLECTION_TEMPLATES.T4_TOPICS_IN_HEAVY_SECTIONS(
      formatTopicList(m.triggers),
      m.triggersClustered
    );
  }

  return null;
}

/**
 * Pick at most one of T6–T7 from sentiment variation.
 * @param {ReturnType<typeof computeMetrics>} m
 */
function selectVariationTemplate(m) {
  if (m.sentenceCount < 3) return null;
  if (m.volatile && !m.steady) return REFLECTION_TEMPLATES.T6_SENTIMENT_SWINGS;
  if (m.steady && !m.volatile) return REFLECTION_TEMPLATES.T7_SENTIMENT_STEADY;
  return null;
}

function dedupeOrdered(strings) {
  const seen = new Set();
  const out = [];
  for (const s of strings) {
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

/**
 * @param {Parameters<typeof computeMetrics>[0]} ctx
 */
export function buildReflections(ctx) {
  const m = computeMetrics(ctx);
  const candidates = [];

  candidates.push(selectNegTemplate(m));

  const trig = selectTriggerTemplate(m);
  if (trig) candidates.push(trig);

  const vari = selectVariationTemplate(m);
  if (vari) candidates.push(vari);

  candidates.push(BOUNDARY);

  let out = dedupeOrdered(candidates);

  let padIdx = 0;
  while (out.length < MIN_REFLECTIONS && padIdx < PAD_OBSERVATIONS.length) {
    out = dedupeOrdered([...out, PAD_OBSERVATIONS[padIdx]]);
    padIdx += 1;
  }

  return out.slice(0, MAX_REFLECTIONS);
}

/**
 * @param {Parameters<typeof computeMetrics>[0]} ctx
 */
export function buildSummary(ctx) {
  const { sentenceCount, negativeCount, avgScore, triggers } = ctx;

  if (sentenceCount === 0) {
    return "No sentences were found in this text — there is nothing here for the lexicon to echo back.";
  }

  const roundedAvg = Math.round(avgScore * 100) / 100;
  const parts = [
    `In ${sentenceCount} sentence${sentenceCount === 1 ? "" : "s"}, the wording averages a sentiment score of about ${roundedAvg} (a rough, mechanical read, not a judgment).`,
  ];

  if (negativeCount > 0) {
    parts.push(
      `${negativeCount} sentence${negativeCount === 1 ? "" : "s"} register as net-negative under the same small lexicon.`
    );
  } else {
    parts.push(
      "No sentence crosses into net-negative territory by that same measure."
    );
  }

  if (triggers.length > 0) {
    parts.push(
      `Recurring nouns in those heavier lines include: ${triggers.slice(0, 6).join(", ")} — things the language keeps near when the tally dips.`
    );
  }

  return parts.join(" ");
}

