import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateRoleSchema, verifyUserSchema } from "../validators/user.validator";
import { ROLES } from "../constants/roles";

const router = Router();

router.use(authenticate);

router.get("/", requireRole(ROLES.ADMIN), userController.getAll);
router.get("/:id", requireRole(ROLES.ADMIN), userController.getById);
router.put(
  "/:id/role",
  requireRole(ROLES.ADMIN),
  validate(updateRoleSchema),
  userController.updateRole
);
router.put(
  "/:id/verify",
  requireRole(ROLES.ADMIN),
  validate(verifyUserSchema),
  userController.setVerified
);

export default router;
