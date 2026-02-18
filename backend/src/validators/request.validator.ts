import { z } from "zod";

export const createRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
  body: z.object({
    message: z.string().max(500).optional(),
  }),
});
