import { z } from "zod";

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    role: z.enum(["ADMIN", "BUYER", "PROBLEM_SOLVER"]),
  }),
});

export const verifyUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    verified: z.boolean(),
  }),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>["body"];
