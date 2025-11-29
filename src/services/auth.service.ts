import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import {
  generateEmailVerificationToken,
  generateEmailVerificationTokenExpires,
} from "../utils/generateToken";

const createUser = async (name: string, email: string, password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerificationToken = generateEmailVerificationToken();
    const emailVerificationExpires = generateEmailVerificationTokenExpires();

    const user = await prisma?.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        authProvider: "email",
        emailVerificationToken,
        emailVerificationExpires,
      },
    });
    return user;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};

const findUserByEmail = async (email: string) => {
  const user = await prisma?.user.findFirst({
    where: { email },
  });
  return user;
};

const verifyEmail = async (token: string) => {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });
  
    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      throw new Error("Verification token expired");
    }
  
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });
  
    return updatedUser;
  };

export { createUser, findUserByEmail, verifyEmail };
