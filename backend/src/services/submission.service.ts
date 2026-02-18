import path from "path";
import fs from "fs";
import { PrismaClient, SubmissionStatus } from "@prisma/client";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../utils/errors";
import type { ReviewSubmissionInput } from "../validators/submission.validator";
import { config } from "../config";

const prisma = new PrismaClient();

export const submissionService = {
  async create(
    taskId: string,
    solverId: string,
    file: { path: string; filename: string; size: number }
  ) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    if (task.project.solverId !== solverId) {
      throw new ForbiddenError("Only assigned solver can submit");
    }

    if (!["CREATED", "IN_PROGRESS"].includes(task.status)) {
      throw new BadRequestError(
        "Task must be CREATED or IN_PROGRESS to submit"
      );
    }

    const submission = await prisma.taskSubmission.create({
      data: {
        taskId,
        filePath: file.path,
        fileName: file.filename,
        fileSize: file.size,
        status: "PENDING",
      },
    });

    await prisma.task.update({
      where: { id: taskId },
      data: { status: "SUBMITTED" },
    });

    const { taskService } = await import("./task.service");
    await taskService.checkAndUpdateProjectStatus(task.projectId);

    const solver = await prisma.user.findUnique({
      where: { id: solverId },
      select: { name: true },
    });
    await prisma.notification.create({
      data: {
        userId: task.project.buyerId,
        type: "TASK_SUBMISSION",
        projectId: task.projectId,
        taskId,
        title: `${solver?.name || "Solver"} submitted task — ready for review`,
        solverName: solver?.name ?? undefined,
      },
    });

    return submission;
  },

  async review(
    submissionId: string,
    buyerId: string,
    input: ReviewSubmissionInput
  ) {
    const submission = await prisma.taskSubmission.findUnique({
      where: { id: submissionId },
      include: { task: { include: { project: true } } },
    });

    if (!submission) {
      throw new NotFoundError("Submission not found");
    }

    if (submission.task.project.buyerId !== buyerId) {
      throw new ForbiddenError("Only project owner can review submissions");
    }

    if (submission.status !== "PENDING") {
      throw new BadRequestError("Submission already reviewed");
    }

    const status: SubmissionStatus =
      input.status === "ACCEPTED" ? "ACCEPTED" : "REJECTED";

    const updated = await prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        status,
        feedback: input.feedback,
        reviewedAt: new Date(),
      },
    });

    if (status === "REJECTED") {
      await prisma.task.update({
        where: { id: submission.taskId },
        data: { status: "IN_PROGRESS" },
      });

      const project = await prisma.project.findUnique({
        where: { id: submission.task.projectId },
      });
      if (project?.status === "SUBMITTED") {
        await prisma.project.update({
          where: { id: submission.task.projectId },
          data: { status: "IN_PROGRESS" },
        });
      }
    } else {
      await prisma.task.update({
        where: { id: submission.taskId },
        data: { status: "COMPLETED" },
      });

      const projectTasks = await prisma.task.findMany({
        where: { projectId: submission.task.projectId },
      });
      const allTasksCompleted = projectTasks.every(
        (t) => t.status === "COMPLETED"
      );
      if (allTasksCompleted) {
        await prisma.project.update({
          where: { id: submission.task.projectId },
          data: { status: "COMPLETED" },
        });
      }
    }

    return updated;
  },

  async getByTask(taskId: string) {
    return prisma.taskSubmission.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getDownloadPath(submissionId: string, userId: string, role: string) {
    const submission = await prisma.taskSubmission.findUnique({
      where: { id: submissionId },
      include: { task: { include: { project: true } } },
    });

    if (!submission) {
      throw new NotFoundError("Submission not found");
    }

    const { project } = submission.task;
    const canAccess =
      role === "ADMIN" ||
      project.buyerId === userId ||
      project.solverId === userId;

    if (!canAccess) {
      throw new ForbiddenError("Access denied");
    }

    let filePath = path.join(
      process.cwd(),
      config.upload.dir,
      path.basename(submission.filePath)
    );
    if (!fs.existsSync(filePath) && fs.existsSync(submission.filePath)) {
      filePath = submission.filePath;
    }

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError("File not found");
    }

    return { filePath, fileName: submission.fileName };
  },
};
