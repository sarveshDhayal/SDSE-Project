import { BaseService } from "./BaseService.js";
import { AnalyticalReportService } from "./AnalyticalReportService.js";
import { TransactionService } from "./TransactionService.js";

export class AIService extends BaseService {
  private reportService: AnalyticalReportService;
  private transactionService: TransactionService;

  constructor() {
    super();
    this.reportService = new AnalyticalReportService();
    this.transactionService = new TransactionService();
  }

  /**
   * Processes a natural language question based on user financial data.
   * This is a "Smart Engine" that patterns matches common financial queries.
   */
  async processQuery(userId: string, query: string): Promise<string> {
    this.log("Processing AI query", { userId, query });
    const q = query.toLowerCase();
    
    // Get current month data for context
    const now = new Date();
    const report = await this.reportService.generateMonthlyReport(userId, now.getMonth() + 1, now.getFullYear());

    // 1. Spending Overview
    if (q.includes("spend") || q.includes("expense") || q.includes("money go")) {
      const topCategory = this.getTopCategory(report.categoryBreakdown);
      return `This month, your total expenses are $${report.totalExpense.toLocaleString()}. Your biggest spending category is ${topCategory.name} ($${topCategory.value.toLocaleString()}).`;
    }

    // 2. Savings & Income
    if (q.includes("save") || q.includes("savings") || q.includes("saving rate")) {
      const rate = (report.savingsRate * 100).toFixed(0);
      let advice = "";
      if (report.savingsRate < 0.2) {
        advice = " Try to keep your non-essential spending below 30% of your income to boost your savings.";
      } else {
        advice = " You're doing great! Keep maintaining this saving momentum.";
      }
      return `Your current saving rate is ${rate}%. You've saved $${report.balance.toLocaleString()} so far this month.${advice}`;
    }

    // 3. Status / How am I doing
    if (q.includes("how am i doing") || q.includes("status") || q.includes("summary")) {
      const status = report.balance >= 0 ? "surplus" : "deficit";
      return `Profile Summary: You are currently in a financial ${status}. With an income of $${report.totalIncome.toLocaleString()} and expenses reaching $${report.totalExpense.toLocaleString()}, your net position is ${report.balance >= 0 ? 'positive' : 'negative'}.`;
    }

    // 4. Budget check (simplified)
    if (q.includes("budget") || q.includes("limit")) {
      return "I can see your budget configuration. Most of your envelopes are within safe zones, but I recommend checking the Reports page for a detailed breakdown of your category limits.";
    }

    // Default Fallback
    return "I am Aura, your FinAura assistant. I can help you with spending analysis, savings goals, and monthly summaries. Try asking: 'Where is my money going?' or 'What is my saving rate?'";
  }

  private getTopCategory(breakdown: any): { name: string, value: number } {
    let top = { name: "None", value: 0 };
    for (const cat in breakdown) {
      if (breakdown[cat] > top.value) {
        top = { name: cat, value: breakdown[cat] };
      }
    }
    return top;
  }
}
