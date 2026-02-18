import { PrismaClient, ProjectStatus } from "@prisma/client";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../utils/errors";
import type { CreateProjectInput, AssignSolverInput } from "../validators/project.validator";

const prisma = new PrismaClient();

const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  OPEN: ["REQUESTED"],
  REQUESTED: ["ASSIGNED"],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["SUBMITTED"],
  SUBMITTED: ["COMPLETED", "REJECTED"],
  COMPLETED: [],
  REJECTED: ["SUBMITTED"],
};

export const projectService = {
  async create(buyerId: string, input: CreateProjectInput) {
    return prisma.project.create({
      data: {
        title: input.title,
        description: input.description,
        buyerId,
        status: "OPEN",
      },
      include: {
        buyer: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  },

  async getAll(userId: string, role: string) {
    const where =
      role === "ADMIN"
        ? {}
        : role === "BUYER"
        ? { buyerId: userId }
        : {
            OR: [
              { status: "OPEN" },
              { solverId: userId },
              { requests: { some: { userId } } },
            ],
          };

    return prisma.project.findMany({
      where,
      include: {
        buyer: {
          select: { id: true, email: true, name: true },
        },
        solver: {
          select: { id: true, email: true, name: true },
        },
        _count: {
          select: { requests: true, tasks: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  async getById(id: string, userId: string, role: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        buyer: {
          select: { id: true, email: true, name: true },
        },
        solver: {
          select: { id: true, email: true, name: true, verified: true },
        },
        requests: {
          include: {
            user: {
              select: { id: true, email: true, name: true, verified: true },
            },
          },
        },
        tasks: {
          orderBy: { orderIndex: "asc" },
          include: {
            submissions: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const canAccess =
      role === "ADMIN" ||
      project.buyerId === userId ||
      project.solverId === userId ||
      project.requests.some((r) => r.userId === userId) ||
      (role === "PROBLEM_SOLVER" && project.status === "OPEN");

    if (!canAccess) {
      throw new ForbiddenError("Access denied");
    }

    const requestUserIds = project.requests.map((r) => r.userId);
    const solverStats =
      requestUserIds.length > 0
        ? await this.getSolverStats(requestUserIds)
        : {};

    const requestsWithStats = project.requests.map((r) => ({
      ...r,
      user: r.user
        ? {
            ...r.user,
            completedProjects: solverStats[r.userId]?.completedProjects ?? 0,
            completedTasks: solverStats[r.userId]?.completedTasks ?? 0,
          }
        : r.user,
    }));

    return {
      ...project,
      requests: requestsWithStats,
    };
  },

  async getSolverStats(userIds: string[]) {
    const completedProjects = await prisma.project.findMany({
      where: {
        solverId: { in: userIds },
        status: "COMPLETED",
      },
      include: {
        _count: { select: { tasks: true } },
      },
    });

    const stats: Record<
      string,
      { completedProjects: number; completedTasks: number }
    > = {};
    for (const uid of userIds) {
      const userProjects = completedProjects.filter((p) => p.solverId === uid);
      stats[uid] = {
        completedProjects: userProjects.length,
        completedTasks: userProjects.reduce((sum, p) => sum + p._count.tasks, 0),
      };
    }
    return stats;
  },

  async assignSolver(
    projectId: string,
    buyerId: string,
    input: AssignSolverInput
  ) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { requests: true },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.buyerId !== buyerId) {
      throw new ForbiddenError("Only project owner can assign solver");
    }

    if (project.status !== "REQUESTED") {
      throw new BadRequestError(
        "Project must be in REQUESTED state to assign solver"
      );
    }

    const request = project.requests.find(
      (r) => r.userId === input.solverId && r.status === "PENDING"
    );

    if (!request) {
      throw new BadRequestError("Invalid solver or no pending request");
    }

    return prisma.$transaction(async (tx) => {
      await tx.projectRequest.updateMany({
        where: { projectId },
        data: { status: "REJECTED" },
      });

      await tx.projectRequest.update({
        where: { id: request.id },
        data: { status: "APPROVED" },
      });

      return tx.project.update({
        where: { id: projectId },
        data: {
          solverId: input.solverId,
          status: "ASSIGNED",
        },
        include: {
          buyer: { select: { id: true, email: true, name: true } },
          solver: { select: { id: true, email: true, name: true } },
        },
      });
    });
  },

  validateTransition(current: ProjectStatus, next: ProjectStatus) {
    const allowed = VALID_TRANSITIONS[current];
    if (!allowed?.includes(next)) {
      throw new BadRequestError(
        `Invalid transition from ${current} to ${next}`
      );
    }
  },
};
