import { prisma } from './prisma';
import * as fs from "node:fs";
import { resolve } from "node:path";
import { loadChefData } from './chef-service';

export async function createDatabase() { 
  const query = fs.readFileSync(resolve(process.cwd(), "../documentation/database/sqlDump.sql"), "utf-8");
  console.log(query);

  const result = await prisma.$queryRaw`${query}`;
  console.log("Result:", result);
}

export async function seed() { 
  const seedData = fs.readFileSync(resolve(process.cwd(), "../documentation/database/seed.sql"), "utf-8");
  console.log(seedData);

  const result = await prisma.$queryRaw`${seedData}`;
  console.log("Seed Result:", result);
}


export async function getAllUsers() {
    try {
        return await prisma.fiok.findMany();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function addUser(userData: any) {
    try {
        return await prisma.fiok.create({ data: userData });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function userCount() {
    try {
        return await prisma.fiok.count();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function previewFoods() {
    try {
        const total = await prisma.recept.count();

        const randomIndex = Math.floor(Math.random() * Math.max(1, total - 10 + 1)); // Első, és utolsó is kerülhet kiválasztásra.

        return await prisma.recept.findMany({
            orderBy: { id: 'asc' },
            skip: randomIndex,
            take: 10
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// A felülethez szükséges receptek, ajánlási csoportok és profiladatok.
export async function personalizedFoods(id: number) {
    return loadChefData(id);
}

export async function hutoTest(id: number) {
    const userFridge = await prisma.huto.findMany({
            where: { profil_id: id },
            select: { alapanyag: true }
        });

    return userFridge;
}

export async function hutoAlapanyagAdas(id: number, alapanyagId: number) {
    const userFridge = await prisma.huto.create({
            data: { profil_id: id, alapanyag_id: alapanyagId }
        });

    return userFridge;
}