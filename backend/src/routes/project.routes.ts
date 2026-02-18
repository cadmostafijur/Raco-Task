import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createProjectSchema,
  projectIdSchema,
  assignSolverSchema,
} from "../validators/project.validator";
import taskRoutes from "./task.routes";
import { requestController } from "../controllers/request.controller";
import { createRequestSchema } from "../validators/request.validator";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  requireRole("BUYER", "ADMIN"),
  validate(createProjectSchema),
  projectController.create
);

router.get("/", projectController.getAll);
router.get("/:id", validate(projectIdSchema), projectController.getById);
router.put(
  "/:id/assign",
  requireRole("BUYER"),
  validate(assignSolverSchema),
  projectController.assignSolver
);

router.post(
  "/:id/requests",
  requireRole("PROBLEM_SOLVER"),
  validate(createRequestSchema),
  requestController.create
);
router.get("/:id/requests", requestController.getByProject);

router.use("/:id/tasks", taskRoutes);

export default router;
