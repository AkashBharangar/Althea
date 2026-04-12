import nlp from "compromise";
import { STOP } from "../utils/stopwords.js";

function nounTokensFromPhrase(phrase) {
  return String(phrase || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function extractNounTokensFromText(text) {
  const doc = nlp(String(text || ""));
  const out = [];
  for (const phrase of doc.nouns().out("array")) {
    out.push(...nounTokensFromPhrase(phrase));
  }
  return out;
}

/**
 * @param {string[]} negativeSentences
 * @param {number} maxTriggers
 * @returns {{ word: string, count: number }[]}
 */
export function extractTriggerRanks(negativeSentences, maxTriggers = 12) {
  const freq = new Map();
  for (const sent of negativeSentences) {
    for (const token of extractNounTokensFromText(sent)) {
      freq.set(token, (freq.get(token) || 0) + 1);
    }
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, maxTriggers)
    .map(([word, count]) => ({ word, count }));
}

/**
 * @param {string[]} negativeSentences
 * @param {number} maxTriggers
 * @returns {string[]}
 */
export function extractTriggersFromNegativeSentences(
  negativeSentences,
  maxTriggers = 12
) {
  return extractTriggerRanks(negativeSentences, maxTriggers).map((r) => r.word);
}
