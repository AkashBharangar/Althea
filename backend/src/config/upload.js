import multer from "multer";
import path from "node:path";

const MAX_UPLOAD_BYTES = 1024 * 1024; // 1MB

export const uploadTextFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const isTextMime =
      file.mimetype === "text/plain" || file.mimetype === "application/octet-stream";

    if (ext !== ".txt" || !isTextMime) {
      const err = new Error('Only ".txt" files are allowed.');
      err.statusCode = 400;
      return cb(err, false);
    }

    return cb(null, true);
  },
});

export function parseUploadMulterError(err, _req, res, next) {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File must be 1MB or smaller." });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  if (err?.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return next(err);
}

