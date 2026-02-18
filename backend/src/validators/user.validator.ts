import { z } from "zod";
import { ROLES } from "../constants/roles";

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    role: z.enum([ROLES.ADMIN, ROLES.BUYER, ROLES.PROBLEM_SOLVER]),
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
