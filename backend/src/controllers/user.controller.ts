import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { userService } from "../services/user.service";
import type { UpdateRoleInput } from "../validators/user.validator";

export const userController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll();
      res.json({
        success: true,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const input = req.body as UpdateRoleInput;
      const user = await userService.updateRole(id, input);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  async setVerified(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { verified } = req.body;
      const user = await userService.setVerified(id, verified);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
};
