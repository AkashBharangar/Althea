import express from "express";
import { createCorsMiddleware } from "./middleware/cors.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { apiRateLimiter } from "./middleware/rateLimit.js";
import { securityMiddleware } from "./middleware/security.js";

import authRouter from "./routes/auth.js";
import analyzeRouter from "./routes/analyze.js";
import uploadsRouter from "./routes/uploads.js";
import entriesRouter from "./routes/entries.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(securityMiddleware);
  app.use(requestLogger);
  app.use(createCorsMiddleware());
  app.use("/api", apiRateLimiter);
  app.use(express.json({ limit: "512kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "althea" });
  });

  // Feature routes
  app.use("/api", authRouter);
  app.use("/api", analyzeRouter);
  app.use("/api", uploadsRouter);
  app.use("/api", entriesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

