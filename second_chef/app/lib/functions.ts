import { prisma } from './prisma';
import * as fs from "node:fs";
import { resolve } from "node:path";
import { recept } from '../generated/prisma/browser';

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

        const randomIndex = Math.floor(Math.random() * (total - 4)); // Első, és utolsó is kerülhet kiválasztásra.

        return await prisma.recept.findMany({
            skip: randomIndex,
            take: 5
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function personalizedFoods(id: number) {
    try {
        // megnézi a profil táblában, hogy a felhasználó milyen kategóriákat kedvel
        const userPreference = await prisma.fiok.findUnique({
            where: { id },
            select: { preferencia: true }
        });

        // megnézi azt hogy milyen alapanyagok vannak a felhasználó hűtőjében
        const userFridge = await prisma.huto.findMany({
            where: { profil_id: id },
            select: { alapanyag: true }
        });

        const alapanyagok = userFridge.map(item => item.alapanyag.nev);
        const preferencia = userPreference?.preferencia;

        // lekérdezi azokat a recepteket, amelyek tartalmazzák a felhasználó kedvenc kategóriáit és legalább 1 alapanyagot a hűtőjében
        const recipes = await prisma.recept.findMany({
            where: {
                recept_alapanyag_osszekoto: {
                    some: {
                        alapanyag: { nev: { in: alapanyagok } }
                    }
                },
                ...(preferencia && { Kategoria: { kategoria: preferencia } })
            },
        });

        const kevert = recipes.sort(() => Math.random() - 0.5).slice(0,5);

        kevert.push(...await prisma.$queryRaw<recept[]>`
        SELECT * FROM "recept"
        WHERE kategoria_id IN (
            SELECT id FROM "Kategoria" WHERE kategoria != ${preferencia}
        )
        ORDER BY RANDOM()
        LIMIT 5
        `);

        return kevert;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function hutoTest(id: number) {
    const userFridge = await prisma.huto.findMany({
            where: { profil_id: id },
            select: { alapanyag: true }
        });

    return userFridge;
}