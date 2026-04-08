import { type Transaction as PrismaTransaction } from "@prisma/client";
import { BaseTransaction } from "../../models/BaseTransaction.js";
import { IncomeTransaction } from "../../models/IncomeTransaction.js";
import { ExpenseTransaction } from "../../models/ExpenseTransaction.js";

export class TransactionMapper {
  public static toDomain(prismaTransaction: PrismaTransaction): BaseTransaction {
    if (prismaTransaction.type === "INCOME") {
      return new IncomeTransaction(
        prismaTransaction.id,
        prismaTransaction.amount,
        prismaTransaction.date,
        prismaTransaction.description || "",
        prismaTransaction.categoryId,
        prismaTransaction.userId
      );
    } else {
      return new ExpenseTransaction(
        prismaTransaction.id,
        prismaTransaction.amount,
        prismaTransaction.date,
        prismaTransaction.description || "",
        prismaTransaction.categoryId,
        prismaTransaction.userId
      );
    }
  }

  public static toPersistence(domainTransaction: BaseTransaction): any {
    return {
      id: domainTransaction.id,
      amount: domainTransaction.amount,
      date: domainTransaction.date,
      description: domainTransaction.description,
      type: domainTransaction.getType(),
      categoryId: domainTransaction.categoryId,
      userId: domainTransaction.userId,
    };
  }
}
