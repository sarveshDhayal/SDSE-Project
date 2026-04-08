import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { Category } from "../models/Category.js";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(category: Category): Promise<Category> {
    return this.categoryRepository.create(category);
  }

  async getCategories(userId: string): Promise<Category[]> {
    return this.categoryRepository.findByUserId(userId);
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    return this.categoryRepository.update(id, updates);
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categoryRepository.delete(id);
  }
}
