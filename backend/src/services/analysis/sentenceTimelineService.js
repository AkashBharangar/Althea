import { splitIntoSentences } from "../../utils/sentences.js";
import { analyzeSentence, isNegativeSentence } from "../sentimentService.js";

/**
 * Build sentence timeline while preserving sentence order.
 * Reuses existing sentimentService logic without changing behavior.
 */
export function buildSentenceTimeline(text) {
  const sentences = splitIntoSentences(text);
  const timeline = [];
  const negativeSentences = [];

  sentences.forEach((sentence, index) => {
    const { score } = analyzeSentence(sentence);
    timeline.push({ sentence, score, index });

    if (isNegativeSentence({ score })) {
      negativeSentences.push(sentence);
    }
  });

  return { timeline, negativeSentences };
}

