import { type IBaseRepository } from "./BaseRepository.js";
import { Category } from "../models/Category.js";
import { PrismaService } from "../services/PrismaService.js";
import { CategoryMapper } from "./mappers/CategoryMapper.js";
import { type Category as PrismaCategory, type Transaction as PrismaTransaction } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export class CategoryRepository implements IBaseRepository<Category> {
  private prisma = PrismaService.getInstance();

  async create(item: Category): Promise<Category> {
    const data = CategoryMapper.toPersistence(item);
    const created = await this.prisma.category.create({ data });
    return CategoryMapper.toDomain(created);
  }

  async update(id: string, item: Partial<Category>): Promise<Category> {
    const data: any = {};
    if (item.name !== undefined) data.name = item.name;

    const updated = await this.prisma.category.update({
      where: { id },
      data
    });
    return CategoryMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.category.delete({ where: { id } });
    return true;
  }

  async findById(id: string): Promise<Category | null> {
    const item = await this.prisma.category.findUnique({ where: { id } });
    return item ? CategoryMapper.toDomain(item as PrismaCategory) : null;
  }

  async findAll(): Promise<Category[]> {
    const items = await this.prisma.category.findMany();
    return items.map((item: PrismaCategory) => CategoryMapper.toDomain(item));
  }

  async findByUserId(userId: string): Promise<Category[]> {
    console.log(`[CategoryRepository] Fetching categories for userId: ${userId}`);
    const items = await this.prisma.category.findMany({ where: { userId } });
    
    // If no categories coexist, seed some defaults
    if (items.length === 0) {
      console.log(`[CategoryRepository] No categories found. Seeding defaults for ${userId}...`);
      const defaults = ["Food", "Transport", "Rent", "Salary", "Entertainment", "Shopping"];
      try {
        for (const name of defaults) {
          await this.prisma.category.create({
            data: {
              id: uuidv4(),
              name,
              userId
            }
          });
        }
        console.log(`[CategoryRepository] Seeding successful.`);
        return this.findByUserId(userId);
      } catch (error) {
        console.error(`[CategoryRepository] Seeding failed:`, error);
        throw error;
      }
    }

    return items.map((item: PrismaCategory) => CategoryMapper.toDomain(item));
  }
}
