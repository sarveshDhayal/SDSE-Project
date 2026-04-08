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

  async getUserTransactions(userId: string): Promise<BaseTransaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactionRepository.delete(id);
  }
}
