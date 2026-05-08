import { getSupabaseClient } from "../config/supabase.js";
import { findOrCreateUserByEmail } from "../services/userService.js";

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header) return null;

  const [scheme, token] = String(header).split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return null;

  return token;
}

/**
 * Reads Supabase-issued JWT and attaches authenticated user to req.user.
 * - If token is missing: req.user = null, continue.
 * - If token exists but is invalid: 401.
 */
export async function currentUser(req, res, next) {
  const token = getBearerToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      req.user = null;
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const dbUser = await findOrCreateUserByEmail({
      id: data.user.id,
      email: data.user.email ?? null,
    });

    req.user = {
      id: dbUser.id,
      email: dbUser.email ?? null,
      createdAt: dbUser.createdAt,
      authUserId: data.user.id,
      appMetadata: data.user.app_metadata ?? {},
      userMetadata: data.user.user_metadata ?? {},
      dbUser,
    };

    return next();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const isConfigError = message.includes("SUPABASE_");

    if (isConfigError) {
      return res.status(500).json({
        error:
          "Supabase auth is not configured correctly on the server. Please try again later.",
      });
    }

    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

