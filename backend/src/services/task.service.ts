import { PrismaClient, TaskStatus, ProjectStatus } from "@prisma/client";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../utils/errors";
import type { CreateTaskInput, UpdateTaskInput } from "../validators/task.validator";

const prisma = new PrismaClient();

export const taskService = {
  async create(projectId: string, solverId: string, input: CreateTaskInput) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { tasks: true },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (project.solverId !== solverId) {
      throw new ForbiddenError("Only assigned solver can create tasks");
    }

    if (!["ASSIGNED", "IN_PROGRESS", "SUBMITTED", "REJECTED"].includes(project.status)) {
      throw new BadRequestError(
        "Project must be ASSIGNED, IN_PROGRESS, SUBMITTED, or REJECTED to add tasks"
      );
    }

    const maxOrder = project.tasks.reduce(
      (max, t) => Math.max(max, t.orderIndex),
      0
    );

    const dueDate = input.dueDate ? new Date(input.dueDate) : undefined;
    const task = await prisma.task.create({
      data: {
        projectId,
        title: input.title,
        description: input.description,
        dueDate,
        orderIndex: maxOrder + 1,
        status: "CREATED",
      },
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "IN_PROGRESS" },
    });

    return task;
  },

  async update(projectId: string, taskId: string, solverId: string, input: UpdateTaskInput) {
    const task = await prisma.task.findUnique({
      where: { id: taskId, projectId },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    if (task.project.solverId !== solverId) {
      throw new ForbiddenError("Only assigned solver can update task");
    }

    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      CREATED: ["IN_PROGRESS"],
      IN_PROGRESS: ["SUBMITTED"],
      SUBMITTED: [],
      COMPLETED: [],
    };

    const data: Record<string, unknown> = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.dueDate !== undefined) {
      data.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    }
    if (input.status !== undefined) {
      const allowed = validTransitions[task.status];
      if (!allowed?.includes(input.status as TaskStatus)) {
        throw new BadRequestError(
          `Invalid status transition from ${task.status} to ${input.status}`
        );
      }
      data.status = input.status;
    }

    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  },

  async getByProject(projectId: string, userId: string, role: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const canAccess =
      role === "ADMIN" ||
      project.buyerId === userId ||
      project.solverId === userId;

    if (!canAccess) {
      throw new ForbiddenError("Access denied");
    }

    return prisma.task.findMany({
      where: { projectId },
      include: {
        submissions: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { orderIndex: "asc" },
    });
  },

  async updateTaskStatus(
    taskId: string,
    solverId: string,
    newStatus: TaskStatus
  ) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    if (task.project.solverId !== solverId) {
      throw new ForbiddenError("Only assigned solver can update task");
    }

    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      CREATED: ["IN_PROGRESS"],
      IN_PROGRESS: ["SUBMITTED"],
      SUBMITTED: [],
      COMPLETED: [],
    };

    const allowed = validTransitions[task.status];
    if (!allowed?.includes(newStatus)) {
      throw new BadRequestError(
        `Invalid transition from ${task.status} to ${newStatus}`
      );
    }

    return prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });
  },

  async checkAndUpdateProjectStatus(projectId: string) {
    const tasks = await prisma.task.findMany({
      where: { projectId },
    });

    const allSubmitted = tasks.length > 0 && tasks.every(
      (t) => t.status === "SUBMITTED" || t.status === "COMPLETED"
    );

    if (allSubmitted) {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: "SUBMITTED" },
      });
    }
  },
};
