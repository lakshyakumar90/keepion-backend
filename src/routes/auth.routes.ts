import { Router } from "express";
import { signinController, signupController, verifyEmailController, googleCallbackController } from "../controllers/auth.controller";
import { signinSchema, signupSchema } from "../validations/auth.validation";
import { validate } from "../middlewares/validation.middleware";
import { signoutController } from "../controllers/auth.controller";
import passport from "passport";

const router = Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/signin", validate(signinSchema), signinController);
router.post("/signout", signoutController);
router.get("/verify-email", verifyEmailController);

// Google Auth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/signin" }),
  googleCallbackController
);

export default router;
