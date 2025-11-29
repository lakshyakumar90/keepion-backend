import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => issue.message).join(", ");
        return res.status(400).json({ message: errors });
      }
      return res.status(400).json({ message: "Validation Failed" });
    }
  };
};
