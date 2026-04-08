import { Report } from "../models/Report.js";
import { BaseTransaction } from "../models/BaseTransaction.js";

export class ReportBuilder {
  private report: Report;

  constructor(id: string, userId: string, startDate: Date, endDate: Date) {
    this.report = new Report(id, userId, startDate, endDate);
  }

  addTransactions(transactions: BaseTransaction[]): ReportBuilder {
    transactions.forEach(t => this.report.addTransaction(t));
    return this;
  }

  build(): Report {
    return this.report;
  }
}
