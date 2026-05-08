import { Router } from "express";
import { attachUserIfPresent } from "../middleware/auth.js";
import { analyzeText } from "../services/analyzeService.js";
import { persistEntryWithAnalysis } from "../services/entryPersistenceService.js";
import { parseTextFileBuffer } from "../utils/fileTextParser.js";
import { parseUploadMulterError, uploadTextFile } from "../config/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const MAX_TEXT_LEN = 12_000;

router.post(
  "/uploads",
  attachUserIfPresent,
  uploadTextFile.single("file"),
  parseUploadMulterError,
  asyncHandler(async (req, res) => {
    const f = req.file;
    const text = parseTextFileBuffer(f);

    if (text.length > MAX_TEXT_LEN) {
      return res.status(400).json({
        error: `Uploaded text must be at most ${MAX_TEXT_LEN} characters.`,
      });
    }

    const result = analyzeText(text);

    if (req.user?.id) {
      const { entryId, uploadId } = await persistEntryWithAnalysis({
        userId: req.user.id,
        userEmail: req.user.email,
        rawText: text,
        source: "UPLOAD",
        upload: {
          originalFilename: f.originalname,
          byteSize: f.size,
          mimeType: f.mimetype,
        },
        analysis: result,
      });

      return res.json({ ...result, entryId, uploadId });
    }

    return res.json(result);
  })
);

export default router;

