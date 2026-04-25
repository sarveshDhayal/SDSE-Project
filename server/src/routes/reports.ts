import express from "express";
import { AnalyticalReportService } from "../services/AnalyticalReportService.js";
import { authMiddleware } from "../auth/AuthMiddleware.js";
import type { AuthRequest } from "../auth/AuthMiddleware.js";

const router = express.Router();
const reportService = new AnalyticalReportService();

router.use(authMiddleware);

// GET /api/reports/monthly
router.get("/monthly", async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: "month and year are required" });
    }

    const report = await reportService.generateMonthlyReport(
      userId!,
      parseInt(month as string),
      parseInt(year as string)
    );
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
