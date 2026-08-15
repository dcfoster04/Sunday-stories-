import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Singleton Prisma Client, SQLite-backed for local dev via a driver
// adapter (Prisma 7 requires one for the SQL workflow). Swapping to
// Postgres/Supabase in production means: change the adapter import to
// `@prisma/adapter-pg`, change `datasource.provider` in schema.prisma,
// and point DATABASE_URL at the Postgres connection string. Nothing
// elsewhere in the app touches the adapter directly.

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

export const db = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}
