import { Notifier } from "../patterns/Observer.js";
import { BaseTransaction } from "../models/BaseTransaction.js";

export class BudgetAlertNotifier extends Notifier {
  update(transaction: BaseTransaction): void {
    if (transaction.getType() === "EXPENSE") {
      console.log(`[ALERT] New Expense tracked: ${transaction.amount} - Checking budget limits...`);
      // In a real app, this would query the BudgetService and send an email/notification if limit exceeded.
    }
  }
}
