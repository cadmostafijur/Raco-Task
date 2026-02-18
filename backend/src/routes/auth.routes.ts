import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from "../validators/auth.validator";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.get("/me", authenticate, authController.me);
router.put(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile
);

export default router;
