import { BaseTransaction } from "./BaseTransaction.js";

export class IncomeTransaction extends BaseTransaction {
  getType(): string {
    return "INCOME";
  }
}
