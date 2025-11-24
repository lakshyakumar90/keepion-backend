import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});