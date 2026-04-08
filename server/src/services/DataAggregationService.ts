import { BaseTransaction } from "../models/BaseTransaction.js";

export class DataAggregationService {
  /**
   * Aggregates transaction amounts by category ID
   */
  public aggregateByCategory(transactions: BaseTransaction[]): Record<string, number> {
    const breakdown: Record<string, number> = {};

    transactions.forEach((t) => {
      // We only aggregate expenses for the category breakdown usually, 
      // but we can include all if needed. Here we follow standard practice: expenses per category.
      if (t.getType() === "EXPENSE") {
        const catId = t.categoryId;
        breakdown[catId] = (breakdown[catId] || 0) + t.amount;
      }
    });

    return breakdown;
  }

  /**
   * Calculates the savings rate based on income and expenses
   */
  public calculateSavingsRate(totalIncome: number, totalExpense: number): number {
    if (totalIncome <= 0) return 0;
    const savings = totalIncome - totalExpense;
    return (savings / totalIncome) * 100;
  }
}
