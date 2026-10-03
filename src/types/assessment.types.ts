import type { PaginatedData, SortOrder } from "@/types/common.types";

export const ASSESSMENT_STATUSES = ["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"] as const;

export type AssessmentStatus = (typeof ASSESSMENT_STATUSES)[number];

export const DIFFICULTY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const ASSESSMENT_SORT_FIELDS = [
	"createdAt",
	"updatedAt",
	"title",
	"applicationDeadline",
	"opensAt",
] as const;

export type AssessmentSortField = (typeof ASSESSMENT_SORT_FIELDS)[number];

export type RecruiterAssessment = {
	id: string;
	title: string;
	jobRole: string;
	skills: string[];
	difficulty: DifficultyLevel;
	status: AssessmentStatus;
	durationMinutes: number;
	passPercentage: number | string;

	applicationDeadline: string | null;
	opensAt: string | null;
	closesAt: string | null;

	creditConsumedAt: string | null;
	publishedAt: string | null;
	closedAt: string | null;

	createdAt: string;
	updatedAt: string;

	_count: {
		assessmentQuestions: number;
		applications: number;
	};
};

export type AssessmentListParams = {
	page: number;
	limit: number;

	search?: string;
	status?: AssessmentStatus;
	difficulty?: DifficultyLevel;

	sortBy: AssessmentSortField;
	sortOrder: SortOrder;
};

export type AssessmentListData = PaginatedData<RecruiterAssessment>;
