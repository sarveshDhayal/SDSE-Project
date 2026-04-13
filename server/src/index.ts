import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { TransactionService } from "./services/TransactionService.js";
import { BudgetAlertNotifier } from "./services/BudgetAlertNotifier.js";
import { AnalyticalReportService } from "./services/AnalyticalReportService.js";
import { CategoryService } from "./services/CategoryService.js";
import { BudgetRepository } from "./repositories/BudgetRepository.js";
import { IncomeTransaction } from "./models/IncomeTransaction.js";
import { ExpenseTransaction } from "./models/ExpenseTransaction.js";
import { Category } from "./models/Category.js";
import { Budget } from "./models/Budget.js";
import { AuthService } from "./auth/AuthService.js";
import { AIService } from "./services/AIService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

const transactionService = new TransactionService();
const budgetNotifier = new BudgetAlertNotifier();
const reportService = new AnalyticalReportService();
const categoryService = new CategoryService();
const budgetRepository = new BudgetRepository();
const authService = AuthService.getInstance();
const aiService = new AIService();

// Hook up Observers
transactionService.attach(budgetNotifier);

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// -------------- AUTH API --------------
app.post("/api/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "Missing idToken" });
    const result = await authService.loginWithGoogle(idToken);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// -------------- AI ASSISTANT API --------------
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { userId, query } = req.body;
    if (!userId || !query) return res.status(400).json({ error: "Missing userId or query" });
    
    const response = await aiService.processQuery(userId, query);
    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------- TRANSACTIONS API --------------
app.post("/api/transactions", async (req, res) => {
  try {
    const { amount, date, description, type, categoryId, userId } = req.body;
    let transaction;
    const id = uuidv4();
    const tDate = date ? new Date(date) : new Date();

    if (type === "INCOME") {
      transaction = new IncomeTransaction(id, amount, tDate, description, categoryId, userId);
    } else if (type === "EXPENSE") {
      transaction = new ExpenseTransaction(id, amount, tDate, description, categoryId, userId);
    } else {
      return res.status(400).json({ error: "Invalid transaction type." });
    }

    const created = await transactionService.addTransaction(transaction);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const transactions = await transactionService.getUserTransactions(req.params.userId, req.query as any);
    res.json(transactions);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const deleted = await transactionService.deleteTransaction(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Transaction not found" });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// -------------- CATEGORIES API --------------
app.post("/api/categories", async (req, res) => {
  try {
    const { name, userId } = req.body;
    const created = await categoryService.createCategory(new Category(uuidv4(), name, userId));
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/categories/:userId", async (req, res) => {
  try {
    const categories = await categoryService.getCategories(req.params.userId);
    res.json(categories);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// -------------- BUDGETS API --------------
app.post("/api/budgets", async (req, res) => {
  try {
    const { amount, categoryId, userId, period } = req.body;
    const budget = new Budget(uuidv4(), amount, categoryId, userId, period || "MONTHLY");
    const created = await budgetRepository.create(budget);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/budgets/:userId", async (req, res) => {
  try {
    const budgets = await budgetRepository.findByUserId(req.params.userId);
    res.json(budgets);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// -------------- REPORTS API --------------
app.get("/api/reports/:userId", async (req, res) => {
  try {
    const { month, year } = req.query;
    const targetMonth = month ? parseInt(month as string, 10) : new Date().getMonth() + 1;
    const targetYear = year ? parseInt(year as string, 10) : new Date().getFullYear();

    const report = await reportService.generateMonthlyReport(req.params.userId, targetMonth, targetYear);
    
    res.json({
      id: report.id, userId: report.userId, totalIncome: report.totalIncome,
      totalExpense: report.totalExpense, balance: report.balance,
      savingsRate: report.savingsRate, categoryBreakdown: report.categoryBreakdown,
      startDate: report.startDate, endDate: report.endDate
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
