import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { taskService } from "../services/task.service";
import type { CreateTaskInput, UpdateTaskInput } from "../validators/task.validator";

export const taskController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const solverId = req.user!.userId;
      const input = req.body as CreateTaskInput;
      const task = await taskService.create(id, solverId, input);
      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, taskId } = req.params;
      const solverId = req.user!.userId;
      const input = req.body as UpdateTaskInput;
      const task = await taskService.update(id, taskId, solverId, input);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  async getByProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const role = req.user!.role;
      const tasks = await taskService.getByProject(id, userId, role);
      res.json({
        success: true,
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  },
};
