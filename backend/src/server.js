import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze.js";

const app = express();
const PORT = Number(process.env.PORT) || 8787;
const clientOrigin =
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin.split(",").map((s) => s.trim()),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "512kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "althea" });
});

app.use("/api", analyzeRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: "Something went wrong on our side. You can try again in a moment.",
  });
});

app.listen(PORT, () => {
  console.log(`Althea API listening on ${PORT}`);
});
