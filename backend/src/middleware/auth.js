import { currentUser } from "./currentUser.js";
import { authMiddleware } from "./authMiddleware.js";

// Backward-compatible aliases used by existing routes.
export const attachUserIfPresent = currentUser;
export const requireUser = authMiddleware;

