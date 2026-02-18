import { Router } from "express";
import { requestController } from "../controllers/request.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);
router.get("/my", requireRole("PROBLEM_SOLVER"), requestController.getMyRequests);

export default router;
