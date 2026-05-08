import { Router } from "express";
import { analyzeText } from "../services/analyzeService.js";
import { attachUserIfPresent } from "../middleware/auth.js";
import { persistEntryWithAnalysis } from "../services/entryPersistenceService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const MAX_TEXT_LEN = 12_000;

router.post("/analyze", attachUserIfPresent, asyncHandler(async (req, res) => {
  const body = req.body || {};

  if (typeof body.text !== "string") {
    return res.status(400).json({
      error: 'Request body must include a string "text" field.',
    });
  }

  const text = body.text.trim();
  if (!text) {
    return res.status(400).json({
      error: "Text must not be empty.",
    });
  }

  if (text.length > MAX_TEXT_LEN) {
    return res.status(400).json({
      error: `Text must be at most ${MAX_TEXT_LEN} characters.`,
    });
  }

  const result = analyzeText(text);

  if (req.user?.id) {
    const { entryId } = await persistEntryWithAnalysis({
      userId: req.user.id,
      userEmail: req.user.email,
      rawText: text,
      source: "MANUAL",
      analysis: result,
    });
    return res.json({ ...result, entryId });
  }

  return res.json(result);
}));

export default router;
