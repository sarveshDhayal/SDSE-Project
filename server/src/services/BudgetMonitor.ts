import { Subject, type Observer } from "../patterns/Observer.js";
import { BaseTransaction } from "../models/BaseTransaction.js";
import { BudgetRepository } from "../repositories/BudgetRepository.js";
import { TransactionRepository } from "../repositories/TransactionRepository.js";

export class BudgetMonitor extends Subject implements Observer {
  private budgetRepository: BudgetRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    super();
    this.budgetRepository = new BudgetRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async update(transaction: any): Promise<void> {
    // If transaction is not a BaseTransaction or not an EXPENSE, ignore.
    if (!transaction || typeof transaction.getType !== 'function' || transaction.getType() !== "EXPENSE") return;

    const { userId, categoryId } = transaction;

    // 1. Find the budget for this category
    const budget = await this.budgetRepository.findBudget(userId, categoryId);
    if (!budget) return;

    // 2. Calculate current spending for this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await this.transactionRepository.findByUserId(userId, {
      startDate: startOfMonth,
      endDate: endOfMonth,
      categoryId
    });

    const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
    const percentage = (totalSpending / budget.amount) * 100;

    // 3. Notify observers based on threshold
    if (percentage >= 100) {
      this.notify({
        type: "BUDGET_EXCEEDED",
        userId,
        categoryId,
        limit: budget.amount,
        spent: totalSpending,
        percentage
      });
    } else if (percentage >= 80) {
      this.notify({
        type: "BUDGET_WARNING",
        userId,
        categoryId,
        limit: budget.amount,
        spent: totalSpending,
        percentage
      });
    }
  }
}
