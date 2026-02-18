import { z } from "zod";

export const createTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(2000).optional(),
    dueDate: z.string().optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
    taskId: z.string().min(1, "Task ID is required"),
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional().nullable(),
    dueDate: z.string().optional().nullable(),
    status: z.enum(["CREATED", "IN_PROGRESS", "SUBMITTED"]).optional(),
  }),
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
    taskId: z.string().min(1, "Task ID is required"),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];
