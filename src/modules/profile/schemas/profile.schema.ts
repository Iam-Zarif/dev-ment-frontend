import { z } from "zod";

const optionalUrl = z
	.string()
	.trim()
	.refine((value) => !value || z.string().url().safeParse(value).success, "Enter a valid URL");

export const candidateProfileSchema = z.object({
	legalName: z.string().trim().min(2).max(120),

	phone: z.string().trim().max(30),

	headline: z.string().trim().max(160),

	bio: z.string().trim().max(2000),

	experienceYears: z.coerce.number().min(0).max(80).multipleOf(0.1),

	skills: z.string().max(1000),

	githubUrl: optionalUrl,
	linkedinUrl: optionalUrl,
	portfolioUrl: optionalUrl,
});

export const recruiterProfileSchema = z.object({
	legalName: z.string().trim().min(2).max(120),

	jobTitle: z.string().trim().max(120),

	phone: z.string().trim().max(30),

	companyWebsiteUrl: optionalUrl,
});

export type CandidateProfileValues = z.infer<typeof candidateProfileSchema>;

export type RecruiterProfileValues = z.infer<typeof recruiterProfileSchema>;
