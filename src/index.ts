import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import { CORS_OPTIONS } from "./config/constants";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cors({
    origin: CORS_OPTIONS.ORIGIN,
    // methods: CORS_OPTIONS.METHODS as unknown as string[],
    // allowedHeaders: CORS_OPTIONS.ALLOWED_HEADERS as unknown as string[],
    credentials: CORS_OPTIONS.ALLOWED_CREDENTIALS,
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});