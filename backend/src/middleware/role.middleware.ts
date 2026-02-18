import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { ForbiddenError } from "../utils/errors";

type Role = "ADMIN" | "BUYER" | "PROBLEM_SOLVER";

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError("Authentication required"));
      return;
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
};
