import { Router } from "express";
import { analyzeText } from "../services/analyzeService.js";

const router = Router();

const MAX_TEXT_LEN = 12_000;

router.post("/analyze", (req, res) => {
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

  try {
    const result = analyzeText(text);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong on our side. You can try again in a moment.",
    });
  }
});

export default router;
