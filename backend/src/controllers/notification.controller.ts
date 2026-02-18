import { Response, NextFunction } from "express";
import { notificationService } from "../services/notification.service";
import type { AuthRequest } from "../types";

export const notificationController = {
  async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;
      const result = await notificationService.getForUser(userId, role);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async markAsSeen(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await notificationService.markAsSeen(req.user!.userId);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
