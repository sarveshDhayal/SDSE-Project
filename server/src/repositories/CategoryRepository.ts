import { type IBaseRepository } from "./BaseRepository.js";
import { Category } from "../models/Category.js";
import { PrismaService } from "../services/PrismaService.js";
import { CategoryMapper } from "./mappers/CategoryMapper.js";
import { type Category as PrismaCategory, type Transaction as PrismaTransaction } from "@prisma/client";

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
    const items = await this.prisma.category.findMany({ where: { userId } });
    return items.map((item: PrismaCategory) => CategoryMapper.toDomain(item));
  }
}
