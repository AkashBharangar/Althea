import cors from "cors";

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

export function createCorsMiddleware() {
  const allowedList = parseOrigins();

  return cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedList.includes(origin)) return callback(null, true);
      if (isVercelPreview(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  });
}

