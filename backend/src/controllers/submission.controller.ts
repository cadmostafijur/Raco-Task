import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { submissionService } from "../services/submission.service";
import type { ReviewSubmissionInput } from "../validators/submission.validator";

export const submissionController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId || req.params.id;
      const solverId = req.user!.userId;
      const file = req.file!;
      const submission = await submissionService.create(taskId, solverId, {
        path: file.path,
        filename: file.filename,
        size: file.size,
      });
      res.status(201).json({
        success: true,
        data: submission,
      });
    } catch (err) {
      next(err);
    }
  },

  async review(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const buyerId = req.user!.userId;
      const input = req.body as ReviewSubmissionInput;
      const submission = await submissionService.review(id, buyerId, input);
      res.json({
        success: true,
        data: submission,
      });
    } catch (err) {
      next(err);
    }
  },

  async getByTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.taskId || req.params.id;
      const submissions = await submissionService.getByTask(taskId);
      res.json({
        success: true,
        data: submissions,
      });
    } catch (err) {
      next(err);
    }
  },

  async download(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const role = req.user!.role;
      const { filePath, fileName } = await submissionService.getDownloadPath(
        id,
        userId,
        role
      );
      res.download(filePath, fileName);
    } catch (err) {
      next(err);
    }
  },
};
