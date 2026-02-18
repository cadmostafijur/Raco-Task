import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { projectService } from "../services/project.service";
import type { CreateProjectInput, AssignSolverInput } from "../validators/project.validator";

export const projectController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const input = req.body as CreateProjectInput;
      const project = await projectService.create(userId, input);
      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;
      const projects = await projectService.getAll(userId, role);
      res.json({
        success: true,
        data: projects,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const role = req.user!.role;
      const project = await projectService.getById(id, userId, role);
      res.json({
        success: true,
        data: project,
      });
    } catch (err) {
      next(err);
    }
  },

  async assignSolver(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const buyerId = req.user!.userId;
      const input = req.body as AssignSolverInput;
      const project = await projectService.assignSolver(id, buyerId, input);
      res.json({
        success: true,
        data: project,
      });
    } catch (err) {
      next(err);
    }
  },
};
