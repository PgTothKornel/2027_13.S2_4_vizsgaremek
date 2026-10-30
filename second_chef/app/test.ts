import dotenv from "dotenv";
import { resolve } from "node:path";
dotenv.config({ path: resolve(process.cwd(), ".env") });

//console.log("DATABASE_URL loaded:", process.env.DATABASE_URL);


async function main() {
  const { getAllUsers, addUser, userCount, seed, createDatabase, previewFoods, hutoTest, personalizedFoods } = await import("./lib/functions");
  /*console.log("Users:");
  const users = await getAllUsers();
  console.log(users);

  /*const newUser = await addUser({ name: "Kornél", email: "durva@hogy.mukodik" });
  console.log("New User:", newUser);*/

  /*const count = await userCount();
  console.log("User Count:", count);*/

  //createDatabase();

  //console.log(await previewFoods());

  /*const hutoContents = await hutoTest(1);
  console.log("Huto Contents:", hutoContents[0].alapanyag.nev);
  const alapanyagok = hutoContents.map(alapanyag => alapanyag.alapanyag.nev);
  console.log("Alapanyagok:", alapanyagok);*/
  //seed();

  console.log(await personalizedFoods(1));
}

main()

//createDatabase()


//console.log("tesztebb");
