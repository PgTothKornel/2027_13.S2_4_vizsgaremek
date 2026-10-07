import { prisma } from "./lib/prisma.ts";

console.log("teszt")
console.log("Connecting to:", process.env.DATABASE_URL);
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

console.log("tesztebb")