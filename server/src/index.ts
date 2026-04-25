import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import categoryRoutes from "./routes/categories.js";
import budgetRoutes from "./routes/budgets.js";
import reportRoutes from "./routes/reports.js";
import { TransactionService } from "./services/TransactionService.js";
import { BudgetAlertNotifier } from "./services/BudgetAlertNotifier.js";
import { BudgetMonitor } from "./services/BudgetMonitor.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

// Setup Services and Observers (Initialization)
const transactionService = TransactionService.getInstance();
const budgetMonitor = new BudgetMonitor();
const budgetNotifier = new BudgetAlertNotifier();
budgetMonitor.attach(budgetNotifier);
transactionService.attach(budgetMonitor);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
