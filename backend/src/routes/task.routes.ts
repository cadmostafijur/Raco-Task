import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator";
import submissionRoutes from "./submission.routes";

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(requireRole("ADMIN", "BUYER", "PROBLEM_SOLVER"));

router.get("/", taskController.getByProject);
router.post(
  "/",
  requireRole("PROBLEM_SOLVER"),
  validate(createTaskSchema),
  taskController.create
);
router.patch(
  "/:taskId",
  requireRole("PROBLEM_SOLVER"),
  validate(updateTaskSchema),
  taskController.update
);

router.use("/:taskId/submissions", submissionRoutes);

export default router;
