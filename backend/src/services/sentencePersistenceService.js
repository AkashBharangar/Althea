function normalizeTimeline(timeline) {
  if (!Array.isArray(timeline)) return [];

  return timeline
    .map((item) => ({
      text: String(item?.sentence ?? "").trim(),
      sentimentScore: Number.isFinite(item?.score) ? Number(item.score) : 0,
      position: Number.isFinite(item?.index) ? Number(item.index) : 0,
    }))
    .filter((item) => item.text.length > 0);
}

/**
 * Persist sentence-level analysis in a dedicated abstraction.
 * Keeps NLP concerns (how scores are computed) out of DB write logic.
 */
export async function persistSentences({ tx, entryId, timeline }) {
  const sentenceRows = normalizeTimeline(timeline);
  if (!sentenceRows.length) return 0;

  await tx.sentence.createMany({
    data: sentenceRows.map((row) => ({
      entryId,
      text: row.text,
      sentimentScore: row.sentimentScore,
      position: row.position,
    })),
  });

  return sentenceRows.length;
}

