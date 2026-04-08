import { type Budget as PrismaBudget } from "@prisma/client";
import { Budget } from "../../models/Budget.js";

export class BudgetMapper {
  public static toDomain(prismaBudget: PrismaBudget): Budget {
    return new Budget(
      prismaBudget.id,
      prismaBudget.amount,
      prismaBudget.categoryId,
      prismaBudget.userId,
      prismaBudget.period
    );
  }

  public static toPersistence(domainBudget: Budget): any {
    return {
      id: domainBudget.id,
      amount: domainBudget.amount,
      categoryId: domainBudget.categoryId,
      userId: domainBudget.userId,
      period: domainBudget.period,
    };
  }
}
