import { TransactionRepository } from "../repositories/TransactionRepository.js";
import { BaseTransaction } from "../models/BaseTransaction.js";
import { Subject, type Observer } from "../patterns/Observer.js";

export class TransactionService extends Subject {
  private transactionRepository: TransactionRepository;

  constructor() {
    super();
    this.transactionRepository = new TransactionRepository();
  }

  async addTransaction(transaction: BaseTransaction): Promise<BaseTransaction> {
    const created = await this.transactionRepository.create(transaction);
    
    // Notify observers (e.g., BudgetAlertNotifier)
    this.notify(created);
    
    return created;
  }

  async getUserTransactions(userId: string, filters?: { startDate?: Date; endDate?: Date; categoryId?: string }): Promise<BaseTransaction[]> {
    return this.transactionRepository.findByUserId(userId, filters);
  }

  async updateTransaction(id: string, updates: Partial<BaseTransaction>): Promise<BaseTransaction> {
    const updated = await this.transactionRepository.update(id, updates);
    this.notify(updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const deleted = await this.transactionRepository.delete(id);
    if (deleted) {
      this.notify(null);
    }
    return deleted;
  }
}
