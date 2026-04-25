import express from "express";
import { BudgetRepository } from "../repositories/BudgetRepository.js";
import { Budget } from "../models/Budget.js";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "../auth/AuthMiddleware.js";
import type { AuthRequest } from "../auth/AuthMiddleware.js";

const router = express.Router();
const budgetRepo = new BudgetRepository();

router.use(authMiddleware);

// GET /api/budgets
router.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const items = await budgetRepo.findByUserId(userId!);
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/budgets
router.post("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { amount, period, categoryId } = req.body;
    const budget = new Budget(uuidv4(), amount, categoryId, userId, period);
    const created = await budgetRepo.create(budget);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
