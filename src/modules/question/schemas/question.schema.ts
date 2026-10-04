import { z } from "zod";

import { DIFFICULTY_LEVELS } from "@/types/assessment.types";
import { MCQ_SELECTION_MODES, QUESTION_TYPES } from "@/types/question.types";

const optionSchema = z.object({
	optionHtml: z
		.string()
		.trim()
		.min(1, "Option content is required")
		.max(10_000, "Option content is too long"),

	isCorrect: z.boolean(),
});

const testCaseSchema = z.object({
	inputText: z.string().max(20_000, "Input is too long"),

	expectedOutput: z.string().max(20_000, "Expected output is too long"),

	isHidden: z.boolean(),

	weight: z.number().positive("Weight must be greater than zero"),
});

export const questionFormSchema = z
	.object({
		type: z.enum(QUESTION_TYPES),

		contentHtml: z
			.string()
			.trim()
			.min(1, "Question content is required")
			.max(50_000, "Question content is too long"),

		difficulty: z.enum(DIFFICULTY_LEVELS),

		defaultMarks: z
			.number()
			.positive("Marks must be greater than zero")
			.max(10_000, "Marks cannot exceed 10000"),

		evaluationRubric: z.string().max(10_000, "Evaluation rubric is too long"),

		selectionMode: z.enum(MCQ_SELECTION_MODES),

		options: z.array(optionSchema).max(20, "Maximum 20 options are allowed"),

		allowedLanguages: z.string(),

		timeLimitMs: z
			.number()
			.int()
			.min(100, "Minimum time limit is 100ms")
			.max(60_000, "Maximum time limit is 60000ms"),

		memoryLimitKb: z
			.number()
			.int()
			.min(1024, "Minimum memory is 1024 KB")
			.max(1_048_576, "Memory limit is too large"),

		testCases: z.array(testCaseSchema).max(50, "Maximum 50 test cases are allowed"),
	})
	.superRefine((data, ctx) => {
		if (data.type === "MCQ") {
			if (data.options.length < 2) {
				ctx.addIssue({
					code: "custom",
					path: ["options"],
					message: "At least two options are required",
				});

				return;
			}

			const correctCount = data.options.filter((option) => option.isCorrect).length;

			if (data.selectionMode === "SINGLE" && correctCount !== 1) {
				ctx.addIssue({
					code: "custom",
					path: ["options"],
					message: "Single choice must have exactly one correct option",
				});
			}

			if (data.selectionMode === "MULTIPLE" && correctCount < 1) {
				ctx.addIssue({
					code: "custom",
					path: ["options"],
					message: "Select at least one correct option",
				});
			}
		}

		if (data.type === "CODING") {
			if (parseQuestionLanguages(data.allowedLanguages).length === 0) {
				ctx.addIssue({
					code: "custom",
					path: ["allowedLanguages"],
					message: "At least one language is required",
				});
			}

			if (data.testCases.length === 0) {
				ctx.addIssue({
					code: "custom",
					path: ["testCases"],
					message: "At least one test case is required",
				});
			}
		}
	});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;

export function parseQuestionLanguages(value: string) {
	return Array.from(
		new Set(
			value
				.split(",")
				.map((item) => item.trim().toLowerCase())
				.filter(Boolean),
		),
	);
}
