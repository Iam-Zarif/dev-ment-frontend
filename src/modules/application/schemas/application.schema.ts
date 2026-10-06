import { z } from "zod";

export const applyAssessmentSchema = z.object({
	coverNote: z.string().trim().max(5000, "Cover note cannot exceed 5000 characters"),
});

export const rejectApplicationSchema = z.object({
	rejectionReason: z.string().trim().max(2000, "Rejection reason cannot exceed 2000 characters"),
});

export type ApplyAssessmentValues = z.infer<typeof applyAssessmentSchema>;

export type RejectApplicationValues = z.infer<typeof rejectApplicationSchema>;
