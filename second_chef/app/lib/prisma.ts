import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

//console.log("DATABASE_URL:", connectionString);

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}