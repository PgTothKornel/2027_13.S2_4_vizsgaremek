import { prisma } from './prisma';
import * as fs from "node:fs";
import { resolve } from "node:path";

export async function createDatabase() { 
  const query = fs.readFileSync(resolve(process.cwd(), "../documentation/database/sqlDump.sql"), "utf-8");
  console.log(query);

  const result = await prisma.$queryRaw`${query}`;
  console.log("Result:", result);
}

export async function seed() { 
  const seedData = fs.readFileSync(resolve(process.cwd(), "../documentation/database/seed.sql"), "utf-8");
  console.log(seedData);

  //const result = await prisma.$queryRaw`${seedData}`;
  //console.log("Seed Result:", result);
}


export async function getAllUsers() {
    try {
        return await prisma.profil.findMany();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function addUser(userData: any) {
    try {
        return await prisma.profil.create({ data: userData });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function userCount() {
    try {
        return await prisma.profil.count();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

