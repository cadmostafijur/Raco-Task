import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../utils/errors";
import type { UpdateRoleInput } from "../validators/user.validator";

const prisma = new PrismaClient();

export const userService = {
  async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  },

  async updateRole(userId: string, input: UpdateRoleInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role: input.role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
      },
    });
  },

  async setVerified(userId: string, verified: boolean) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return prisma.user.update({
      where: { id: userId },
      data: { verified },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        verified: true,
      },
    });
  },
};
