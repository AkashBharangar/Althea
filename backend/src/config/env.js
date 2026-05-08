export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,

  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,

  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: process.env.RATE_LIMIT_MAX,
};

