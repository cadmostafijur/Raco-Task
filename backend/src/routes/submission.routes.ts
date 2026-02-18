import { Router } from "express";
import { submissionController } from "../controllers/submission.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { uploadZip } from "../middleware/upload.middleware";
import { reviewSubmissionSchema } from "../validators/submission.validator";
import { ROLES } from "../constants/roles";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", submissionController.getByTask);
router.get("/:id/download", submissionController.download);
router.post(
  "/",
  requireRole(ROLES.PROBLEM_SOLVER),
  uploadZip.single("file"),
  submissionController.create
);
router.put(
  "/:id/review",
  requireRole(ROLES.BUYER),
  validate(reviewSubmissionSchema),
  submissionController.review
);

export default router;
