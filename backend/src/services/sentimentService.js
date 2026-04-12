import Sentiment from "sentiment";

const analyzer = new Sentiment();

/**
 * @param {string} sentence
 * @returns {{ score: number, comparative: number, positive: string[], negative: string[] }}
 */
export function analyzeSentence(sentence) {
  const s = String(sentence || "").trim();
  if (!s) {
    return { score: 0, comparative: 0, positive: [], negative: [] };
  }
  const r = analyzer.analyze(s);
  return {
    score: r.score,
    comparative: r.comparative,
    positive: r.positive || [],
    negative: r.negative || [],
  };
}

/**
 * Sentiment package: score < 0 → net negative lexicon in that span.
 * @param {{ score: number }} result
 */
export function isNegativeSentence(result) {
  return result.score < 0;
}
