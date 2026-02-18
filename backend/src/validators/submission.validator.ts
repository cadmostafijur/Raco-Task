import { z } from "zod";

export const reviewSubmissionSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Submission ID is required"),
  }),
  body: z.object({
    status: z.enum(["ACCEPTED", "REJECTED"]),
    feedback: z.string().max(1000).optional(),
  }),
});

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>["body"];
