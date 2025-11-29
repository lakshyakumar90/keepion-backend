import { Request, Response } from "express";
import { prisma } from "../config/database";
import { createUser, findUserByEmail } from "../services/auth.service";
import bcrypt from "bcryptjs";
import { SignupInput, SigninInput } from "../validations/auth.validation";

const signupController = async (req: Request, res: Response) => {
  try {
    const validatedData = req.body as SignupInput;
    const { name, email, password } = validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser(name, email, password);

    if (!user) {
      return res
        .status(500)
        .json({ message: "Failed to create user. Try again later." });
    }

    const { hashedPassword, ...safeUser } = user;

    return res
      .status(201)
      .json({ message: "User created successfully", user: safeUser });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const signinController = async (req: Request, res: Response) => {
  try {
    const validatedData = req.body as SigninInput;
    const { email, password } = validatedData;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.hashedPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const { hashedPassword, ...safeUser } = user;

    return res.status(200).json({ 
      message: "Signin successful", 
      user: safeUser 
    });
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { signupController, signinController };
