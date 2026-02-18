import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(2000).optional(),
  }),
});

export const projectIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
});

export const assignSolverSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
  body: z.object({
    solverId: z.string().min(1, "Solver ID is required"),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>["body"];
export type AssignSolverInput = z.infer<typeof assignSolverSchema>["body"];
