import type { DifficultyLevel } from "@/types/assessment.types";
import type { PaginatedData, SortOrder } from "@/types/common.types";

export const QUESTION_TYPES = ["MCQ", "SHORT_TEXT", "LONG_TEXT", "CODING"] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export const MCQ_SELECTION_MODES = ["SINGLE", "MULTIPLE"] as const;

export type McqSelectionMode = (typeof MCQ_SELECTION_MODES)[number];

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

	selectionMode: McqSelectionMode | null;
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

type CreateQuestionBase = {
	contentHtml: string;
	difficulty: DifficultyLevel;
	defaultMarks: number;
	evaluationRubric?: string | null;
};

export type CreateQuestionInput =
	| (CreateQuestionBase & {
			type: "SHORT_TEXT" | "LONG_TEXT";
	  })
	| (CreateQuestionBase & {
			type: "MCQ";
			selectionMode: McqSelectionMode;
			options: Array<{
				optionHtml: string;
				isCorrect: boolean;
				sortOrder: number;
			}>;
	  })
	| (CreateQuestionBase & {
			type: "CODING";
			allowedLanguages: string[];
			starterCode?: Record<string, string> | null;
			timeLimitMs: number;
			memoryLimitKb: number;
			testCases: Array<{
				inputText?: string | null;
				expectedOutput: string;
				isHidden: boolean;
				weight: number;
				sortOrder: number;
			}>;
	  });
