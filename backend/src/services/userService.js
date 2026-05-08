import { getPrisma } from "../prisma/prismaClient.js";

/**
 * Find user by email; create if absent.
 * Supabase Google OAuth reliably provides email, so email is the lookup key.
 */
export async function findOrCreateUserByEmail({ id, email }) {
  if (!email) {
    throw new Error("Authenticated user email is required for persistence.");
  }

  const prisma = getPrisma();
  const normalizedEmail = String(email).trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) return existing;

  return prisma.user.create({
    data: {
      id,
      email: normalizedEmail,
    },
  });
}

