
// Prisma config — using PostgreSQL (Neon)
// Make sure your .env has: DATABASE_URL="postgres://user:password@neon.tech/db"
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
