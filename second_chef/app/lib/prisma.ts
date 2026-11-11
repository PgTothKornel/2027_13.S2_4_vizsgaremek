import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

//console.log("DATABASE_URL:", connectionString);

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaClientClass?: typeof PrismaClient;
};

// After client regeneration, a hot-reloaded dev server must not reuse a client
// built for the previous schema (for example, the old User-only data model).
const previousPrisma = globalForPrisma.prisma;
const cachedPrisma = globalForPrisma.prismaClientClass === PrismaClient
  ? previousPrisma : undefined;

export const prisma =
  cachedPrisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

if (process.env.NODE_ENV !== "production") {
  if (previousPrisma && previousPrisma !== prisma) {
    void previousPrisma.$disconnect().catch(() => {});
  }
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaClientClass = PrismaClient;
}
