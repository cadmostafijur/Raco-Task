import { Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import type { RegisterInput, LoginInput } from "../validators/auth.validator";
import type { AuthRequest } from "../types";

export const authController = {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = req.body as RegisterInput;
      const result = await authService.register(input);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = req.body as LoginInput;
      const result = await authService.login(input);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.userId);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.updateProfile(req.user!.userId, req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
};
