import { sign, verify, JwtPayload, Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const generateToken = (userId: string, email: string) => {
  return sign(
    { userId, email },
    (JWT_SECRET as string as Secret) ?? "",
    { expiresIn: JWT_EXPIRES_IN as unknown as number }
  );
};

export const verifyToken = (token: string) => {
  try {
    return verify(token, JWT_SECRET) as JwtPayload & { userId: string; email: string };
  } catch (error) {
    return null;
  }
};
