import { currentUser } from "./currentUser.js";

/**
 * Requires an authenticated Supabase user.
 * Must run after currentUser has attempted token resolution.
 */
export async function authMiddleware(req, res, next) {
  await currentUser(req, res, () => {});

  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  return next();
}

