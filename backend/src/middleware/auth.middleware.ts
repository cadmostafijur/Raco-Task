import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthRequest } from "../types";
import { UnauthorizedError } from "../utils/errors";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role as "ADMIN" | "BUYER" | "PROBLEM_SOLVER",
    };

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid token"));
    } else if (err instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError("Token expired"));
    } else {
      next(err);
    }
  }
};
