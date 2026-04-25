import express from "express";
import { CategoryService } from "../services/CategoryService.js";
import { Category } from "../models/Category.js";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "../auth/AuthMiddleware.js";
import type { AuthRequest } from "../auth/AuthMiddleware.js";

const router = express.Router();
const categoryService = new CategoryService();

router.use(authMiddleware);

// GET /api/categories
router.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const categories = await categoryService.getCategories(userId!);
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/categories
router.post("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { name } = req.body;
    const category = new Category(uuidv4(), name, userId);
    const created = await categoryService.createCategory(category);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
