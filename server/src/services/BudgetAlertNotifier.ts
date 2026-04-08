import { type Notifier } from "../patterns/Observer.js";

export class BudgetAlertNotifier implements Notifier {
  update(alertData: any): void {
    if (alertData.type === "BUDGET_EXCEEDED") {
      console.log(`[ALERT] Budget EXCEEDED! User: ${alertData.userId}, Category: ${alertData.categoryId}. Limit: ${alertData.limit}, Spent: ${alertData.spent} (${alertData.percentage.toFixed(2)}%)`);
    } else if (alertData.type === "BUDGET_WARNING") {
      console.log(`[WARNING] Budget at 80% limit. User: ${alertData.userId}, Category: ${alertData.categoryId}. Limit: ${alertData.limit}, Spent: ${alertData.spent} (${alertData.percentage.toFixed(2)}%)`);
    }
  }
}
