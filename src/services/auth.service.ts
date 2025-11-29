import bcrypt from "bcryptjs";
import { prisma } from "../config/database";

const createUser = async (name: string, email: string, password: string) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma?.user.create({
            data: {
                name,
                email,
                hashedPassword,
            },
        });
        return user;
    } catch (error) {
        throw new Error("Failed to create user");
    }
}

const findUserByEmail = async (email: string) => {
    const user = await prisma?.user.findFirst({
        where: { email },
    });
    return user;
}

export { createUser, findUserByEmail };
