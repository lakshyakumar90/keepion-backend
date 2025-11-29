import { Router } from "express";
import { signinController, signupController, verifyEmailController } from "../controllers/auth.controller";
import { signinSchema, signupSchema } from "../validations/auth.validation";
import { validate } from "../middlewares/validation.middleware";
import { signoutController } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/signin", validate(signinSchema), signinController);
router.post("/signout", signoutController);
router.get("/verify-email", verifyEmailController);

export default router;
