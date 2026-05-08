import { Router } from "express";
import { attachUserIfPresent } from "../middleware/auth.js";

const router = Router();

router.get("/me", attachUserIfPresent, (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  return res.json({
    id: req.user.id,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
});

export default router;

