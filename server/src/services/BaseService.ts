import { PrismaClient } from '@prisma/client';

/**
 * BaseService - An abstract base class for all application services.
 * Demonstrates encapsulation of the data source and common utility methods.
 */
export abstract class BaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * commonLogger - A simple logging utility inherited by all services.
   */
  protected log(action: string, metadata?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[SERVICE_LOG] ${timestamp} - ${action}`, metadata || '');
  }

  /**
   * handleError - Centralized basic error handling logic for subclasses.
   */
  protected handleError(error: any, context: string): never {
    this.log(`ERROR in ${context}`, error?.message || error);
    throw error;
  }

  /**
   * formatCurrency - Formats a numeric value as a currency string.
   */
  protected formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }
}
