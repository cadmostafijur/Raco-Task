import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { requestService } from "../services/request.service";

export const requestController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const { message } = req.body;
      const request = await requestService.create(id, userId, message);
      res.status(201).json({
        success: true,
        data: request,
      });
    } catch (err) {
      next(err);
    }
  },

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const requests = await requestService.getByProject(id);
      res.json({
        success: true,
        data: requests,
      });
    } catch (err) {
      next(err);
    }
  },

  async getMyRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const requests = await requestService.getMyRequests(userId);
      res.json({
        success: true,
        data: requests,
      });
    } catch (err) {
      next(err);
    }
  },
};
