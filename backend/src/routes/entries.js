import { Router } from "express";
import { getPrisma } from "../prisma/prismaClient.js";
import { requireUser } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

function mapEntryToAnalyzeLikeResponse(entry) {
  const timeline = (entry.sentences ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((s) => ({
      sentence: s.text,
      score: s.sentimentScore,
      index: s.position,
    }));

  const triggers = (entry.triggers ?? [])
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((t) => t.word);

  const triggerRanks = (entry.triggers ?? [])
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((t) => ({ word: t.word, count: t.count }));

  const reflections = (entry.reflections ?? [])
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((r) => r.text);

  return {
    entryId: entry.id,
    timeline,
    triggers,
    triggerRanks,
    reflections,
    summary: entry.analysis?.summary ?? "",
    createdAt: entry.createdAt,
    source: entry.source,
  };
}

router.get("/entries", requireUser, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const prisma = getPrisma();

  const entries = await prisma.entry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      source: true,
      createdAt: true,
      analysis: { select: { summary: true } },
    },
  });

  return res.json(
    entries.map((e) => ({
      entryId: e.id,
      source: e.source,
      createdAt: e.createdAt,
      summary: e.analysis?.summary ?? "",
    }))
  );
}));

router.get("/entries/:entryId", requireUser, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const entryId = String(req.params.entryId);
  const prisma = getPrisma();

  const entry = await prisma.entry.findFirst({
    where: { id: entryId, userId },
    include: {
      analysis: true,
      sentences: true,
      reflections: true,
      triggers: true,
    },
  });

  if (!entry) {
    return res.status(404).json({ error: "Entry not found." });
  }

  return res.json(mapEntryToAnalyzeLikeResponse(entry));
}));

export default router;

