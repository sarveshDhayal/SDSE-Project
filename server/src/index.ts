import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { TransactionService } from "./services/TransactionService.js";
import { BudgetAlertNotifier } from "./services/BudgetAlertNotifier.js";
import { IncomeTransaction } from "./models/IncomeTransaction.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

// Setup Services and Observers
const transactionService = new TransactionService();
const budgetNotifier = new BudgetAlertNotifier();
transactionService.attach(budgetNotifier);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Demo endpoint to create a transaction using the OO domain logic
app.post("/api/transactions/demo", async (req, res) => {
  try {
    const { amount, description, userId, categoryId } = req.body;
    
    // Using Domain Model
    const transaction = new IncomeTransaction(
      uuidv4(),
      amount,
      new Date(),
      description,
      categoryId,
      userId
    );

    const created = await transactionService.addTransaction(transaction);
    res.json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
