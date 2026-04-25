import express from "express";
import { TransactionService } from "../services/TransactionService.js";
import { IncomeTransaction } from "../models/IncomeTransaction.js";
import { ExpenseTransaction } from "../models/ExpenseTransaction.js";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "../auth/AuthMiddleware.js";
import type { AuthRequest } from "../auth/AuthMiddleware.js";

const router = express.Router();
const transactionService = TransactionService.getInstance();

// Apply middleware to all transaction routes
router.use(authMiddleware);

// GET /api/transactions
router.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, categoryId } = req.query;
    const filters: { startDate?: Date; endDate?: Date; categoryId?: string } = {};
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    if (categoryId) filters.categoryId = categoryId as string;
    const transactions = await transactionService.getUserTransactions(userId!, filters);
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/transactions
router.post("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { amount, description, categoryId, type, date } = req.body;
    
    let transaction;
    const transactionId = uuidv4();
    const transactionDate = date ? new Date(date) : new Date();

    if (type === "INCOME") {
      transaction = new IncomeTransaction(transactionId, amount, transactionDate, description, categoryId, userId!);
    } else {
      transaction = new ExpenseTransaction(transactionId, amount, transactionDate, description, categoryId, userId!);
    }

    const created = await transactionService.addTransaction(transaction);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/transactions/:id
router.delete("/:id", async (req, res) => {
  try {
    const success = await transactionService.deleteTransaction(req.params.id);
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
