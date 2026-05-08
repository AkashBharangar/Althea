import { getPrisma } from "../prisma/prismaClient.js";
import { persistSentences } from "./sentencePersistenceService.js";

function toTriggerRanks(analysis) {
  if (Array.isArray(analysis?.triggerRanks) && analysis.triggerRanks.length) {
    // Expected shape: [{ word, count }, ...]
    return analysis.triggerRanks.map((r) => ({
      word: String(r.word ?? "").trim(),
      count: Number.isFinite(r.count) ? Number(r.count) : 0,
    }));
  }

  // Backwards compatibility: we only have `triggers` as words.
  if (Array.isArray(analysis?.triggers) && analysis.triggers.length) {
    return analysis.triggers.map((w) => ({ word: String(w).trim(), count: 0 }));
  }

  return [];
}

function toReflections(analysis) {
  return Array.isArray(analysis?.reflections) ? analysis.reflections.map(String) : [];
}

export async function persistEntryWithAnalysis({
  userId,
  userEmail,
  rawText,
  source,
  analysis,
  upload,
}) {
  const prisma = getPrisma();
  const timeline = Array.isArray(analysis?.timeline) ? analysis.timeline : [];
  const triggerRanks = toTriggerRanks(analysis);
  const reflections = toReflections(analysis);
  const summary = String(analysis?.summary ?? "").trim();

  if (!userId) {
    throw new Error("persistEntryWithAnalysis requires userId.");
  }

  if (!rawText || typeof rawText !== "string") {
    throw new Error("persistEntryWithAnalysis requires rawText string.");
  }

  if (!summary) {
    throw new Error("persistEntryWithAnalysis requires analysis.summary.");
  }

  return prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { id: userId },
      update: {
        ...(userEmail ? { email: userEmail } : {}),
      },
      create: {
        id: userId,
        email: userEmail ?? null,
      },
    });

    const entry = await tx.entry.create({
      data: {
        userId,
        source: source ?? "MANUAL",
        rawText,
      },
      select: { id: true },
    });

    const entryId = entry.id;

    await persistSentences({ tx, entryId, timeline });

    if (triggerRanks.length) {
      await tx.triggerRank.createMany({
        data: triggerRanks.map((r, i) => ({
          entryId,
          rank: i,
          word: r.word,
          count: r.count,
        })),
      });
    }

    await tx.analysis.create({
      data: {
        entryId,
        summary,
      },
    });

    if (reflections.length) {
      await tx.reflection.createMany({
        data: reflections.map((text, i) => ({
          entryId,
          index: i,
          text,
        })),
      });
    }

    let uploadId = null;
    if (upload) {
      const uploadRow = await tx.upload.create({
        data: {
          userId,
          originalFilename: String(upload.originalFilename ?? "upload.txt"),
          byteSize: Number(upload.byteSize ?? 0),
          mimeType: upload.mimeType ? String(upload.mimeType) : null,
          entryId,
        },
        select: { id: true },
      });
      uploadId = uploadRow.id;
    }

    return { entryId, uploadId };
  });
}

