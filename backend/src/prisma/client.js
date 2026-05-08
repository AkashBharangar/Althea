import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is missing. Set it to a Neon Postgres connection string."
    );
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });
}

export function getPrisma() {
  if (globalForPrisma.__altheaPrisma) return globalForPrisma.__altheaPrisma;

  const prisma = createPrismaClient();

  // Reuse singleton in non-production to prevent hot-reload connection churn.
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.__altheaPrisma = prisma;
  }

  return prisma;
}

