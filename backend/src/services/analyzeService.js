import { splitIntoSentences } from "../utils/sentences.js";
import { analyzeSentence, isNegativeSentence } from "./sentimentService.js";
import { extractTriggerRanks } from "./triggerService.js";
import { buildReflections, buildSummary } from "./reflectionService.js";

/**
 * @param {string} text
 * @returns {{
 *   timeline: { sentence: string, score: number, index: number }[],
 *   triggers: string[],
 *   reflections: string[],
 *   summary: string,
 * }}
 */
export function analyzeText(text) {
  const sentences = splitIntoSentences(text);

  const timeline = [];
  const negativeSents = [];

  sentences.forEach((sentence, index) => {
    const { score } = analyzeSentence(sentence);
    timeline.push({ sentence, score, index });
    if (isNegativeSentence({ score })) {
      negativeSents.push(sentence);
    }
  });

  const triggerRanks = extractTriggerRanks(negativeSents);
  const triggers = triggerRanks.map((r) => r.word);

  const sentenceCount = timeline.length;
  const negativeCount = negativeSents.length;
  const avgScore =
    sentenceCount > 0
      ? timeline.reduce((a, t) => a + t.score, 0) / sentenceCount
      : 0;

  const ctx = {
    sentenceCount,
    negativeCount,
    avgScore,
    triggers,
    triggerRanks,
    timeline,
  };

  return {
    timeline,
    triggers,
    reflections: buildReflections(ctx),
    summary: buildSummary(ctx),
  };
}
