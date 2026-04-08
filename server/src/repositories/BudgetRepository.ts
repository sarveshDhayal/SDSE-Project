import { type IBaseRepository } from "./BaseRepository.js";
import { Budget } from "../models/Budget.js";
import { PrismaService } from "../services/PrismaService.js";
import { BudgetMapper } from "./mappers/BudgetMapper.js";
import { type Budget as PrismaBudget } from "@prisma/client";

export class BudgetRepository implements IBaseRepository<Budget> {
  private prisma = PrismaService.getInstance();

  async create(item: Budget): Promise<Budget> {
    const data = BudgetMapper.toPersistence(item);
    const created = await this.prisma.budget.create({ data });
    return BudgetMapper.toDomain(created);
  }

  async update(id: string, item: Partial<Budget>): Promise<Budget> {
    const data: any = {};
    if (item.amount !== undefined) data.amount = item.amount;
    if (item.period !== undefined) data.period = item.period;

    const updated = await this.prisma.budget.update({
      where: { id },
      data
    });
    return BudgetMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.budget.delete({ where: { id } });
    return true;
  }

  async findById(id: string): Promise<Budget | null> {
    const item = await this.prisma.budget.findUnique({ where: { id } });
    return item ? BudgetMapper.toDomain(item as PrismaBudget) : null;
  }

  async findAll(): Promise<Budget[]> {
    const items = await this.prisma.budget.findMany();
    return items.map((item: PrismaBudget) => BudgetMapper.toDomain(item));
  }

  async findByUserId(userId: string): Promise<Budget[]> {
    const items = await this.prisma.budget.findMany({ where: { userId } });
    return items.map((item: PrismaBudget) => BudgetMapper.toDomain(item));
  }

  async findBudget(userId: string, categoryId: string): Promise<Budget | null> {
    const item = await this.prisma.budget.findFirst({
      where: { userId, categoryId }
    });
    return item ? BudgetMapper.toDomain(item as PrismaBudget) : null;
  }
}
