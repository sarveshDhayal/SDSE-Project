import { TransactionService } from "../services/TransactionService.js";
import { BudgetMonitor } from "../services/BudgetMonitor.js";
import { BudgetAlertNotifier } from "../services/BudgetAlertNotifier.js";
import { CategoryService } from "../services/CategoryService.js";
import { BudgetRepository } from "../repositories/BudgetRepository.js";
import { AnalyticalReportService } from "../services/AnalyticalReportService.js";
import { IncomeTransaction } from "../models/IncomeTransaction.js";
import { ExpenseTransaction } from "../models/ExpenseTransaction.js";
import { Category } from "../models/Category.js";
import { Budget } from "../models/Budget.js";
import { v4 as uuidv4 } from "uuid";

async function verify() {
  console.log("🚀 Starting Full Project Verification...");

  // 1. Setup Services and Observer Chain
  const transactionService = TransactionService.getInstance();
  const budgetMonitor = new BudgetMonitor();
  const alertNotifier = new BudgetAlertNotifier();

  // Chain: TransactionService -> BudgetMonitor -> BudgetAlertNotifier
  transactionService.attach(budgetMonitor);
  budgetMonitor.attach(alertNotifier);

  const categoryService = new CategoryService();
  const budgetRepo = new BudgetRepository();
  const reportService = new AnalyticalReportService();

  const userId = uuidv4();
  const categoryId = uuidv4();

  console.log("\n--- Step 1: Data Setup ---");
  
  // Create User first (required for FK constraints)
  const userRepository = new (await import("../repositories/UserRepository.js")).UserRepository();
  const user = new (await import("../models/User.js")).User(userId, "Test User", "test@example.com", "google-123");
  await userRepository.create(user);
  console.log("✅ User Created");

  // Create Category
  const category = new Category(categoryId, "Food & Dining", userId);
  await categoryService.createCategory(category);
  console.log("✅ Category Created");

  // Create Budget ($100)
  const budget = new Budget(uuidv4(), 100, categoryId, userId, "MONTHLY");
  await budgetRepo.create(budget);
  console.log("✅ Budget Created ($100 limit)");

  console.log("\n--- Step 2: Transaction & Observer Verification ---");

  // Add Income
  const income = new IncomeTransaction(uuidv4(), 1000, new Date(), "Salary", categoryId, userId);
  await transactionService.addTransaction(income);
  console.log("✅ Income Added ($1000)");

  // Add Expense ($85) - Should trigger 80% warning
  console.log("📝 Adding Expense ($85)... Expecting Budget WARNING:");
  const expense = new ExpenseTransaction(uuidv4(), 85, new Date(), "Dinner", categoryId, userId);
  await transactionService.addTransaction(expense);

  // Add Expense ($20) - Should trigger 100% alert
  console.log("\n📝 Adding Expense ($20)... Expecting Budget EXCEEDED:");
  const expense2 = new ExpenseTransaction(uuidv4(), 20, new Date(), "Lunch", categoryId, userId);
  await transactionService.addTransaction(expense2);

  console.log("\n--- Step 3: Reporting & Builder Verification ---");
  const now = new Date();
  const report = await reportService.generateMonthlyReport(userId, now.getMonth() + 1, now.getFullYear());
  
  console.log("\n📊 Generated Report Summary:");
  console.log(`- Period: ${report.startDate.toLocaleDateString()} to ${report.endDate.toLocaleDateString()}`);
  console.log(`- Total Income: $${report.totalIncome}`);
  console.log(`- Total Expense: $${report.totalExpense}`);
  console.log(`- Balance: $${report.balance}`);
  console.log(`- Savings Rate: ${report.savingsRate.toFixed(2)}%`);
  console.log("- Category Breakdown:", JSON.stringify(report.categoryBreakdown, null, 2));

  console.log("\n✅ Verification Complete!");
  process.exit(0);
}

verify().catch(err => {
  console.error("❌ Verification Failed:", err);
  process.exit(1);
});
