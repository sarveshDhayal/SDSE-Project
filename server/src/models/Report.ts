import { BaseTransaction } from "./BaseTransaction.js";

export class Report {
  private _id: string;
  private _userId: string;
  private _totalIncome: number;
  private _totalExpense: number;
  private _startDate: Date;
  private _endDate: Date;
  private _transactions: BaseTransaction[];
  private _categoryBreakdown: Record<string, number>;
  private _savingsRate: number;

  constructor(id: string, userId: string, startDate: Date, endDate: Date) {
    this._id = id;
    this._userId = userId;
    this._startDate = startDate;
    this._endDate = endDate;
    this._totalIncome = 0;
    this._totalExpense = 0;
    this._transactions = [];
    this._categoryBreakdown = {};
    this._savingsRate = 0;
  }

  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get startDate(): Date { return this._startDate; }
  get endDate(): Date { return this._endDate; }
  get totalIncome(): number { return this._totalIncome; }
  get totalExpense(): number { return this._totalExpense; }
  get balance(): number { return this._totalIncome - this._totalExpense; }
  get savingsRate(): number { return this._savingsRate; }
  set savingsRate(value: number) { this._savingsRate = value; }

  get categoryBreakdown(): Record<string, number> { return { ...this._categoryBreakdown }; }
  set categoryBreakdown(value: Record<string, number>) { this._categoryBreakdown = value; }

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
