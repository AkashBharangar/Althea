import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze.js";

const app = express();
const PORT = Number(process.env.PORT) || 8787;

const defaultLocal = "http://localhost:5173";

function parseOrigins() {
  const raw = process.env.CLIENT_ORIGIN || defaultLocal;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isVercelPreview(origin) {
  if (process.env.ALLOW_VERCEL_PREVIEWS !== "1") return false;
  try {
    const u = new URL(origin);
    return u.protocol === "https:" && u.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

const allowedList = parseOrigins();

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedList.includes(origin)) {
      return callback(null, true);
    }
    if (isVercelPreview(origin)) {
      return callback(null, true);
    }
    callback(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
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
