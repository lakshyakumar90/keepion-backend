import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters long")
    .trim(),
  email: z
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(50, "Password must be less than 50 characters long")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")    
  .trim(),
});

export const signinSchema = z.object({
  email: z
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .trim(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;