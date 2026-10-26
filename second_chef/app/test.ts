import dotenv from "dotenv";
import { resolve } from "node:path";
dotenv.config({ path: resolve(process.cwd(), ".env") });

//console.log("DATABASE_URL loaded:", process.env.DATABASE_URL);


async function main() {
  const { getAllUsers, addUser, userCount } = await import("./lib/functions");
  console.log("Users:");
  const users = await getAllUsers();
  console.log(users);

  /*const newUser = await addUser({ name: "Kornél", email: "durva@hogy.mukodik" });
  console.log("New User:", newUser);*/

  const count = await userCount();
  console.log("User Count:", count);
}

main()

//console.log("tesztebb");
