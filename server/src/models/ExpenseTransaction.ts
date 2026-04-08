import { BaseTransaction } from "./BaseTransaction.js";

export class ExpenseTransaction extends BaseTransaction {
  getType(): string {
    return "EXPENSE";
  }
}
