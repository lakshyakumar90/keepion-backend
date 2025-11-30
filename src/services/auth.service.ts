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

const findOrCreateGoogleUser = async (profile: any) => {
  const { id, displayName, emails, photos } = profile;
  const email = emails[0].value;
  const avatarUrl = photos[0]?.value;

  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: id }, { email: email }],
      },
    });

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: id,
            authProvider: user.authProvider === "email" ? "google_linked" : "google",
            avatarUrl: user.avatarUrl || avatarUrl,
            emailVerified: true,
          },
        });
      }
      return user;
    }

    user = await prisma.user.create({
      data: {
        name: displayName,
        email,
        googleId: id,
        authProvider: "google",
        avatarUrl,
        emailVerified: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in findOrCreateGoogleUser", error);
    throw new Error("Failed to authenticate with Google");
  }
};

const resendVerificationToken = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    throw new Error("Email already verified");
  }

  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = generateEmailVerificationTokenExpires();

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken,
      emailVerificationExpires,
    },
  });

  return updatedUser;
};

export {
  createUser,
  findUserByEmail,
  verifyEmail,
  findOrCreateGoogleUser,
  resendVerificationToken,
};
