import { TransactionService } from "./TransactionService.js";
import { ReportBuilder } from "../patterns/ReportBuilder.js";
import { Report } from "../models/Report.js";
import { v4 as uuidv4 } from "uuid";

export class AnalyticalReportService {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = TransactionService.getInstance();
  }

  /**
   * Generates a comprehensive monthly report for a user
   */
  async generateMonthlyReport(userId: string, month: number, year: number): Promise<Report> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    // 1. Fetch data
    const transactions = await this.transactionService.getUserTransactions(userId, {
      startDate,
      endDate
    });

    // 2. Build report using Builder Pattern
    const builder = new ReportBuilder(uuidv4(), userId);
    
    const report = builder
      .setPeriod(startDate, endDate)
      .addTransactions(transactions)
      .aggregateCategoryBreakdown()
      .calculateStatistics()
      .build();

    return report;
  }
}
