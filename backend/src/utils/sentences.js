import nlp from "compromise";

/**
 * Split prose into sentences using compromise, with a regex fallback.
 * @param {string} text
 * @returns {string[]}
 */
export function splitIntoSentences(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const doc = nlp(raw);
  const fromNlp = doc
    .sentences()
    .out("array")
    .map((s) => String(s).trim())
    .filter(Boolean);

  if (fromNlp.length > 0) return fromNlp;

  return fallbackSplit(raw);
}

/** When compromise yields no boundaries (rare), split on . ! ? */
function fallbackSplit(text) {
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text];
}
