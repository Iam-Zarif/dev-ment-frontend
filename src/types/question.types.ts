import type { DifficultyLevel } from "@/types/assessment.types";
import type { PaginatedData, SortOrder } from "@/types/common.types";

export const QUESTION_TYPES = ["MCQ", "SHORT_TEXT", "LONG_TEXT", "CODING"] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_SORT_FIELDS = [
	"createdAt",
	"updatedAt",
	"defaultMarks",
	"difficulty",
] as const;

export type QuestionSortField = (typeof QUESTION_SORT_FIELDS)[number];

export type RecruiterQuestion = {
	id: string;
	type: QuestionType;
	contentHtml: string;
	difficulty: DifficultyLevel;

	defaultMarks: number | string;
	evaluationRubric: string | null;

	selectionMode: "SINGLE" | "MULTIPLE" | null;

	allowedLanguages: string[];

	timeLimitMs: number | null;
	memoryLimitKb: number | null;

	createdAt: string;
	updatedAt: string;

	createdByRecruiter: {
		id: string;
		user: {
			legalName: string;
		};
	};

	_count: {
		options: number;
		codingTestCases: number;
		assessmentQuestions: number;
	};
};

export type QuestionListParams = {
	page: number;
	limit: number;

	search?: string;
	type?: QuestionType;
	difficulty?: DifficultyLevel;

	sortBy: QuestionSortField;
	sortOrder: SortOrder;
};

export type QuestionListData = PaginatedData<RecruiterQuestion>;
