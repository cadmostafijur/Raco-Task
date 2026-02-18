import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { config } from "../config";
import { UnauthorizedError, BadRequestError } from "../utils/errors";
import type { RegisterInput, LoginInput } from "../validators/auth.validator";
import { ROLES } from "../constants/roles";

const prisma = new PrismaClient();

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new BadRequestError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
        role: ROLES.PROBLEM_SOLVER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role);
    return { user, ...tokens };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  },

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret
      ) as { userId: string; email: string; role: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      const tokens = this.generateTokens(user.id, user.email, user.role);
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        ...tokens,
      };
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new UnauthorizedError("User not found");
    return user;
  },

  async updateProfile(userId: string, data: { name?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  },

  generateTokens(userId: string, email: string, role: string) {
    const accessToken = jwt.sign(
      { userId, email, role },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiry } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { userId, email, role },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiry } as jwt.SignOptions
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  },
};
