import { Request, Response } from "express";
import { prisma } from "../config/database";
import {
  createUser,
  findUserByEmail,
  verifyEmail,
  resendVerificationToken,
} from "../services/auth.service";
import bcrypt from "bcryptjs";
import { SignupInput, SigninInput } from "../validations/auth.validation";
import { generateToken } from "../utils/jwt.util";
import { sendVerificationEmail } from "../utils/email";

const signupController = async (req: Request, res: Response) => {
  try {
    const validatedData = req.body as SignupInput;
    const { name, email, password } = validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        try {
          const updatedUser = await resendVerificationToken(email);
          if (updatedUser.emailVerificationToken) {
            await sendVerificationEmail(
              updatedUser.email,
              updatedUser.emailVerificationToken
            );
          }
          return res.status(400).json({
            message:
              "Account already exists but not verified. We've sent a new verification email to your inbox.",
          });
        } catch (error) {
          console.error("Error resending verification:", error);
          return res.status(400).json({
            message:
              "Account already exists but not verified. Please check your email or request a new verification link.",
          });
        }
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await createUser(name, email, password);

    if (!user) {
      return res
        .status(500)
        .json({ message: "Failed to create user. Try again later." });
    }

    if (user.emailVerificationToken) {
      await sendVerificationEmail(user.email, user.emailVerificationToken);
    }

    const token = generateToken(user.id, user.email || "");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash, ...safeUser } = user;

    return res.status(201).json({
      message:
        "User created successfully. Please check your email to verify your account.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const user = await verifyEmail(token);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Verification Error:", error);
    return res
      .status(400)
      .json({ message: error.message || "Verification failed" });
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

    if (!user.passwordHash) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (!user.emailVerified) {
      try {
        const updatedUser = await resendVerificationToken(email);
        if (updatedUser.emailVerificationToken) {
          await sendVerificationEmail(
            updatedUser.email,
            updatedUser.emailVerificationToken
          );
        }
        return res.status(401).json({
          message:
            "Email not verified. We've sent a new verification email to your inbox. Please verify your email to continue.",
        });
      } catch (error) {
        console.error("Error resending verification:", error);
        return res.status(401).json({
          message:
            "Email not verified. Please check your email for the verification link.",
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = generateToken(user.id, user.email || "");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash, ...safeUser } = user;

    return res.status(200).json({
      message: "Signin successful",
      user: safeUser,
    });
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const signoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    console.error("Signout Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = generateToken(user.id, user.email || "");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}`);
  } catch (error) {
    console.error("Google Callback Error:", error);
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/signin?error=auth_failed`);
  }
};

const resendVerificationController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await resendVerificationToken(email);

    if (user.emailVerificationToken) {
      await sendVerificationEmail(user.email, user.emailVerificationToken);
    }

    return res
      .status(200)
      .json({ message: "Verification email sent successfully" });
  } catch (error: any) {
    console.error("Resend Verification Error:", error);
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.message === "Email already verified") {
      return res.status(400).json({ message: "Email already verified" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  signupController,
  signinController,
  signoutController,
  verifyEmailController,
  googleCallbackController,
  resendVerificationController,
};
