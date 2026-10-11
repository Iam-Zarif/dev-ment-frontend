import { z } from "zod";

const optionalUrl = z
	.string()
	.trim()
	.max(2048, "URL is too long")
	.refine(
		(value) => !value || (z.string().url().safeParse(value).success && /^https?:\/\//i.test(value)),
		"Enter a valid HTTP or HTTPS URL",
	);

export const applyAssessmentSchema = z.object({
	coverNote: z.string().trim().max(5000, "Cover note cannot exceed 5000 characters"),

	githubUrl: optionalUrl,
	linkedinUrl: optionalUrl,
	portfolioUrl: optionalUrl,
});

export const rejectApplicationSchema = z.object({
	rejectionReason: z.string().trim().max(2000, "Rejection reason cannot exceed 2000 characters"),
});

export type ApplyAssessmentValues = z.infer<typeof applyAssessmentSchema>;

export type RejectApplicationValues = z.infer<typeof rejectApplicationSchema>;
