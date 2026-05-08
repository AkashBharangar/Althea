import { extractTriggerRanks } from "../triggerService.js";

function averageScore(timeline) {
  if (!timeline.length) return 0;
  return timeline.reduce((sum, point) => sum + point.score, 0) / timeline.length;
}

/**
 * Build shared analysis context consumed by reflection + summary builders.
 */
export function buildAnalysisContext({ timeline, negativeSentences }) {
  const triggerRanks = extractTriggerRanks(negativeSentences);
  const triggers = triggerRanks.map((rank) => rank.word);

  return {
    sentenceCount: timeline.length,
    negativeCount: negativeSentences.length,
    avgScore: averageScore(timeline),
    triggers,
    triggerRanks,
    timeline,
  };
}

