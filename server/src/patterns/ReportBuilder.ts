import { Report } from "../models/Report.js";
import { BaseTransaction } from "../models/BaseTransaction.js";
import { DataAggregationService } from "../services/DataAggregationService.js";

export class ReportBuilder {
  private id: string;
  private userId: string;
  private startDate: Date = new Date();
  private endDate: Date = new Date();
  private transactions: BaseTransaction[] = [];
  private aggregationService: DataAggregationService;

  constructor(id: string, userId: string) {
    this.id = id;
    this.userId = userId;
    this.aggregationService = new DataAggregationService();
  }

  public setPeriod(startDate: Date, endDate: Date): ReportBuilder {
    this.startDate = startDate;
    this.endDate = endDate;
    return this;
  }

  public addTransactions(transactions: BaseTransaction[]): ReportBuilder {
    this.transactions.push(...transactions);
    return this;
  }

  public calculateStatistics(): ReportBuilder {
    // Handled in build()
    return this;
  }

  public aggregateCategoryBreakdown(): ReportBuilder {
    // Handled in build()
    return this;
  }

  public build(): Report {
    const report = new Report(this.id, this.userId, this.startDate, this.endDate);
    
    this.transactions.forEach(t => report.addTransaction(t));

    const breakdown = this.aggregationService.aggregateByCategory(report.transactions);
    report.categoryBreakdown = breakdown;

    const savingsRate = this.aggregationService.calculateSavingsRate(
      report.totalIncome,
      report.totalExpense
    );
    report.savingsRate = savingsRate;

    return report;
  }
}
