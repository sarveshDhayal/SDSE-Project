import { type IBaseRepository } from "./BaseRepository.js";
import { User } from "../models/User.js";
import { PrismaService } from "../services/PrismaService.js";
import { UserMapper } from "./mappers/UserMapper.js";
import { type User as PrismaUser } from "@prisma/client";

export class UserRepository implements IBaseRepository<User> {
  private prisma = PrismaService.getInstance();

  async create(item: User): Promise<User> {
    const data = UserMapper.toPersistence(item);
    const created = await this.prisma.user.create({ data });
    return UserMapper.toDomain(created);
  }

  async update(id: string, item: Partial<User>): Promise<User> {
    const data: any = {};
    if (item.name !== undefined) data.name = item.name;
    if (item.email !== undefined) data.email = item.email;
    if (item.googleId !== undefined) data.googleId = item.googleId;

    const updated = await this.prisma.user.update({
      where: { id },
      data
    });
    return UserMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.user.delete({ where: { id } });
    return true;
  }

  async findById(id: string): Promise<User | null> {
    const item = await this.prisma.user.findUnique({ where: { id } });
    return item ? UserMapper.toDomain(item as PrismaUser) : null;
  }

  async findAll(): Promise<User[]> {
    const items = await this.prisma.user.findMany();
    return items.map((item: PrismaUser) => UserMapper.toDomain(item));
  }

  async findByEmail(email: string): Promise<User | null> {
    const item = await this.prisma.user.findUnique({ where: { email } });
    return item ? UserMapper.toDomain(item) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const item = await this.prisma.user.findUnique({ where: { googleId } });
    return item ? UserMapper.toDomain(item) : null;
  }

  async upsertGoogleUser(data: { email: string; name: string | null; googleId: string }): Promise<User> {
    const item = await this.prisma.user.upsert({
      where: { googleId: data.googleId },
      update: {
        name: data.name,
        email: data.email,
      },
      create: {
        googleId: data.googleId,
        email: data.email,
        name: data.name,
      },
    });
    return UserMapper.toDomain(item);
  }
}
