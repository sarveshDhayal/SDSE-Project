import { BaseTransaction } from "./BaseTransaction.js";

export class Report {
  private _id: string;
  private _userId: string;
  private _totalIncome: number;
  private _totalExpense: number;
  private _startDate: Date;
  private _endDate: Date;
  private _transactions: BaseTransaction[];

  constructor(id: string, userId: string, startDate: Date, endDate: Date) {
    this._id = id;
    this._userId = userId;
    this._startDate = startDate;
    this._endDate = endDate;
    this._totalIncome = 0;
    this._totalExpense = 0;
    this._transactions = [];
  }

  get id(): string { return this._id; }
  get totalIncome(): number { return this._totalIncome; }
  get totalExpense(): number { return this._totalExpense; }
  get balance(): number { return this._totalIncome - this._totalExpense; }

  addTransaction(transaction: BaseTransaction) {
    this._transactions.push(transaction);
    if (transaction.getType() === "INCOME") {
      this._totalIncome += transaction.amount;
    } else {
      this._totalExpense += transaction.amount;
    }
  }

  get transactions(): BaseTransaction[] { return [...this._transactions]; }
}
