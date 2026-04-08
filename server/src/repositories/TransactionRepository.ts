import { type IBaseRepository } from "./BaseRepository.js";
import { BaseTransaction } from "../models/BaseTransaction.js";
import { PrismaService } from "../services/PrismaService.js";
import { TransactionMapper } from "./mappers/TransactionMapper.js";
import { type Transaction as PrismaTransaction } from "@prisma/client";

export class TransactionRepository implements IBaseRepository<BaseTransaction> {
  private prisma = PrismaService.getInstance();

  async create(item: BaseTransaction): Promise<BaseTransaction> {
    const data = TransactionMapper.toPersistence(item);
    const created = await this.prisma.transaction.create({ data });
    return TransactionMapper.toDomain(created);
  }

  async update(id: string, item: Partial<BaseTransaction>): Promise<BaseTransaction> {
    const data: any = {};
    if (item.amount !== undefined) data.amount = item.amount;
    if (item.description !== undefined) data.description = item.description;
    if (item.date !== undefined) data.date = item.date;

    const updated = await this.prisma.transaction.update({
      where: { id },
      data
    });
    return TransactionMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.transaction.delete({ where: { id } });
    return true;
  }

  async findById(id: string): Promise<BaseTransaction | null> {
    const item = await this.prisma.transaction.findUnique({ where: { id } });
    return item ? TransactionMapper.toDomain(item) : null;
  }

  async findAll(): Promise<BaseTransaction[]> {
    const items = await this.prisma.transaction.findMany();
    return items.map((item: PrismaTransaction) => TransactionMapper.toDomain(item));
  }

  async findByUserId(userId: string, filters?: { startDate?: Date; endDate?: Date; categoryId?: string }): Promise<BaseTransaction[]> {
    const where: any = { userId };
    
    if (filters) {
      if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) where.date.gte = filters.startDate;
        if (filters.endDate) where.date.lte = filters.endDate;
      }
      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }
    }

    const items = await this.prisma.transaction.findMany({ where });
    return items.map((item: PrismaTransaction) => TransactionMapper.toDomain(item));
  }
}
