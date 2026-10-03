import { z } from "zod";

import { DIFFICULTY_LEVELS } from "@/types/assessment.types";

function parseSkills(value: string) {
	return Array.from(
		new Set(
			value
				.split(",")
				.map((skill) => skill.trim())
				.filter(Boolean),
		),
	);
}

const skillsSchema = z
	.string()
	.trim()
	.superRefine((value, ctx) => {
		const skills = parseSkills(value);

		if (skills.length > 30) {
			ctx.addIssue({
				code: "custom",
				message: "Maximum 30 skills are allowed",
			});
		}

		if (skills.some((skill) => skill.length > 80)) {
			ctx.addIssue({
				code: "custom",
				message: "Each skill must be 80 characters or less",
			});
		}
	});

function parseOptionalDate(value: string) {
	if (!value) {
		return null;
	}

	const date = new Date(value);

	return Number.isNaN(date.getTime()) ? null : date;
}

export const assessmentBuilderSchema = z
	.object({
		title: z
			.string()
			.trim()
			.min(2, "Title must be at least 2 characters")
			.max(220, "Title cannot exceed 220 characters"),

		jobRole: z
			.string()
			.trim()
			.min(2, "Job role must be at least 2 characters")
			.max(180, "Job role cannot exceed 180 characters"),

		skills: skillsSchema,

		difficulty: z.enum(DIFFICULTY_LEVELS),

		durationMinutes: z
			.number()
			.int()
			.positive("Duration must be greater than zero")
			.max(1440, "Duration cannot exceed 1440 minutes"),

		passPercentage: z
			.number()
			.positive("Pass percentage must be greater than zero")
			.max(100, "Pass percentage cannot exceed 100"),

		suspiciousThreshold: z
			.number()
			.int()
			.positive("Threshold must be greater than zero")
			.max(100, "Threshold cannot exceed 100"),

		applicationDeadline: z.string(),

		opensAt: z.string(),

		closesAt: z.string(),
	})
	.superRefine((data, ctx) => {
		const opensAt = parseOptionalDate(data.opensAt);

		const closesAt = parseOptionalDate(data.closesAt);

		const applicationDeadline = parseOptionalDate(data.applicationDeadline);

		if (opensAt && closesAt && opensAt >= closesAt) {
			ctx.addIssue({
				code: "custom",
				path: ["closesAt"],
				message: "Closing time must be after opening time",
			});
		}

		if (applicationDeadline && closesAt && applicationDeadline > closesAt) {
			ctx.addIssue({
				code: "custom",
				path: ["applicationDeadline"],
				message: "Application deadline cannot be after closing time",
			});
		}
	});

export type AssessmentBuilderValues = z.infer<typeof assessmentBuilderSchema>;

export function parseAssessmentSkills(value: string) {
	return parseSkills(value);
}
