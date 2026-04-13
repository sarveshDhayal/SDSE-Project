import { TransactionService } from "./TransactionService.js";
import { ReportBuilder } from "../patterns/ReportBuilder.js";
import { Report } from "../models/Report.js";
import { v4 as uuidv4 } from "uuid";
import { BaseService } from "./BaseService.js";

export class AnalyticalReportService extends BaseService {
  private transactionService: TransactionService;

  constructor() {
    super();
    this.transactionService = new TransactionService();
  }

  /**
   * Generates a comprehensive monthly report for a user
   */
  async generateMonthlyReport(userId: string, month: number, year: number): Promise<Report> {
    this.log("Generating monthly report", { userId, month, year });
    
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

    this.log("Report generated successfully", { reportId: report.id });
    return report;
  }
}
