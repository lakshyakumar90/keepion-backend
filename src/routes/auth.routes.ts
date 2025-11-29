import { Router } from "express";
import { signinController, signupController } from "../controllers/auth.controller";
import { signinSchema, signupSchema } from "../validations/auth.validation";
import { validate } from "../middlewares/validation.middleware";

const router = Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/signin", validate(signinSchema), signinController);

export default router;
