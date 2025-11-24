import { Request, Response } from "express";
import { prisma } from "../config/database";
import { createUser } from "../services/auth.service";

const signupController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

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

export { signupController };