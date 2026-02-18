import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateRoleSchema, verifyUserSchema } from "../validators/user.validator";

const router = Router();

router.use(authenticate);

router.get("/", requireRole("ADMIN"), userController.getAll);
router.get("/:id", requireRole("ADMIN"), userController.getById);
router.put(
  "/:id/role",
  requireRole("ADMIN"),
  validate(updateRoleSchema),
  userController.updateRole
);
router.put(
  "/:id/verify",
  requireRole("ADMIN"),
  validate(verifyUserSchema),
  userController.setVerified
);

export default router;
