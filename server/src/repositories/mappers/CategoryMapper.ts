import { type Category as PrismaCategory } from "@prisma/client";
import { Category } from "../../models/Category.js";

export class CategoryMapper {
  public static toDomain(prismaCategory: PrismaCategory): Category {
    return new Category(
      prismaCategory.id,
      prismaCategory.name,
      prismaCategory.userId
    );
  }

  public static toPersistence(domainCategory: Category): any {
    return {
      id: domainCategory.id,
      name: domainCategory.name,
      userId: domainCategory.userId,
    };
  }
}
