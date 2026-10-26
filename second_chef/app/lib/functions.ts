import {prisma} from './prisma';

export async function getAllUsers() {
    try {
        return await prisma.user.findMany();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function addUser(userData: any) {
    try {
        return await prisma.user.create({ data: userData });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function userCount() {
    try {
        return await prisma.user.count();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

