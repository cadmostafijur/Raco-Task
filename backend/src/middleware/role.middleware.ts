import { Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { AuthRequest } from "../types";
import { ForbiddenError } from "../utils/errors";

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
