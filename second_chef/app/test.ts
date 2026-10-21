import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

console.log("DATABASE_URL loaded:", process.env.DATABASE_URL);

const { prisma } = await import("../app/lib/prisma.ts");

async function main() {
  const newUser = await prisma.user.create({
    data: {
      email: "noel@kocsis",
      name: "NKoel",
    },
  });

  console.log("User created successfully:", newUser);
}

main()
  .catch((e) => {
    console.error("Database error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

console.log("tesztebb");
