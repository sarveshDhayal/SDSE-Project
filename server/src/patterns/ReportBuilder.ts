import { Report } from "../models/Report.js";
import { BaseTransaction } from "../models/BaseTransaction.js";
import { DataAggregationService } from "../services/DataAggregationService.js";

export class ReportBuilder {
  private report: Report;
  private aggregationService: DataAggregationService;

  constructor(id: string, userId: string) {
    // Initial partial state
    this.report = new Report(id, userId, new Date(), new Date());
    this.aggregationService = new DataAggregationService();
  }

  public setPeriod(startDate: Date, endDate: Date): ReportBuilder {
    // We recreate for simplicity or use setters if available. 
    // Since Report is OO, we'll use a hack or update the existing private fields via methods.
    // Let's assume we can update them or just store them in the builder until build().
    // Actually, let's update the Report model with setters for these if needed, 
    // or just pass them to the builder constructor.
    // Refined approach: Builder holds state, produces Report at build().
    
    // For now, I'll update the existing report instance's state.
    (this.report as any)._startDate = startDate;
    (this.report as any)._endDate = endDate;
    return this;
  }

  public addTransactions(transactions: BaseTransaction[]): ReportBuilder {
    transactions.forEach(t => this.report.addTransaction(t));
    return this;
  }

  public calculateStatistics(): ReportBuilder {
    const savingsRate = this.aggregationService.calculateSavingsRate(
      this.report.totalIncome,
      this.report.totalExpense
    );
    this.report.savingsRate = savingsRate;
    return this;
  }

  public aggregateCategoryBreakdown(): ReportBuilder {
    const breakdown = this.aggregationService.aggregateByCategory(
      this.report.transactions
    );
    this.report.categoryBreakdown = breakdown;
    return this;
  }

  public build(): Report {
    return this.report;
  }
}
