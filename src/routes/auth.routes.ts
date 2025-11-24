import { Router } from "express";
import { signupController } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signupController);
router.post("/signin", (req, res) => {
  res.send("Signin");
});
router.post("/signout", (req, res) => {
  res.send("Signout");
});

export default router;
