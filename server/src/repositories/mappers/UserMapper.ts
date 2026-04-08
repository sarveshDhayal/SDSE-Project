import { type User as PrismaUser } from "@prisma/client";
import { User } from "../../models/User.js";

export class UserMapper {
  public static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.googleId
    );
  }

  public static toPersistence(domainUser: User): any {
    return {
      id: domainUser.id,
      name: domainUser.name,
      email: domainUser.email,
      googleId: domainUser.googleId
    };
  }
}
