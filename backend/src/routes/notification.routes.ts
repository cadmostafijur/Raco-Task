import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, notificationController.getNotifications);
router.post("/seen", authenticate, notificationController.markAsSeen);

export default router;
