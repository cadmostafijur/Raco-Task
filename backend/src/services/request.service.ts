import { PrismaClient } from "@prisma/client";
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
} from "../utils/errors";

const prisma = new PrismaClient();

export const requestService = {
  async create(projectId: string, userId: string, message?: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.status !== "OPEN") {
      throw new BadRequestError("Project is not open for requests");
    }

    const existing = await prisma.projectRequest.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (existing) {
      throw new ConflictError("You have already requested to work on this project");
    }

    const [request] = await prisma.$transaction([
      prisma.projectRequest.create({
        data: {
          projectId,
          userId,
          message,
        },
      }),
      prisma.project.update({
        where: { id: projectId },
        data: { status: "REQUESTED" },
      }),
    ]);

    return prisma.projectRequest.findUnique({
      where: { id: request.id },
      include: {
        project: {
          select: { id: true, title: true, status: true },
        },
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  },

  async getByProject(projectId: string) {
    return prisma.projectRequest.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getMyRequests(userId: string) {
    return prisma.projectRequest.findMany({
      where: { userId },
      include: {
        project: {
          select: { id: true, title: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
