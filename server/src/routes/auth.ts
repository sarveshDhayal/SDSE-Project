import express from "express";
import { AuthService } from "../auth/AuthService.js";

const router = express.Router();
const authService = AuthService.getInstance();

// POST /api/auth/google
// Frontend sends the Google ID Token
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "idToken is required" });

    const result = await authService.loginWithGoogle(idToken);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Mock login for demo purposes (if user doesn't have Google Client ID set up yet)
router.post("/demo", async (req, res) => {
    const { email, name } = req.body;
    const result = await authService.loginDemo(
      email || "demo@example.com",
      name || "Demo User"
    );
    res.json(result);
});

export default router;
