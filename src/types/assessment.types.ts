import type { PaginatedData, SortOrder } from "@/types/common.types";
import type { RecruiterQuestion } from "./question.types";

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
export type CreateAssessmentDraftInput = {
	title: string;
	jobRole: string;
	skills: string[];
	difficulty: DifficultyLevel;

	durationMinutes: number;
	passPercentage: number;
	suspiciousThreshold: number;

	applicationDeadline?: string | null;
	opensAt?: string | null;
	closesAt?: string | null;
};

export type AssessmentSaveState = {
	state: "SAVED";
	mode: "AUTO" | "MANUAL";
	savedAt: string;
};

export type PublishReadinessIssue = {
	path?: string;
	code?: string;
	message: string;
};

export type PublishReadiness = {
	canPublish: boolean;
	issues: PublishReadinessIssue[];
};

export type AssessmentDraftResult = {
	id: string;
	status: AssessmentStatus;
	createdAt: string;
	updatedAt: string;

	saveState: AssessmentSaveState;

	publishReadiness: PublishReadiness;
};
export type AssessmentQuestionItem = {
	id: string;
	questionId: string;
	sortOrder: number;
	marks: number | string;
	createdAt: string;

	question: Pick<RecruiterQuestion, "id" | "type" | "contentHtml" | "difficulty" | "defaultMarks">;
};

export type AssessmentDetails = {
	id: string;

	title: string;
	jobRole: string;

	descriptionHtml: string | null;
	instructionsHtml: string | null;

	skills: string[];
	difficulty: DifficultyLevel;
	status: AssessmentStatus;

	durationMinutes: number;
	passPercentage: number | string;
	suspiciousThreshold: number;

	applicationDeadline: string | null;
	opensAt: string | null;
	closesAt: string | null;

	creditConsumedAt: string | null;
	publishedAt: string | null;
	closedAt: string | null;

	createdAt: string;
	updatedAt: string;

	company: {
		id: string;
		name: string;
		domain: string;
	};

	assessmentQuestions: AssessmentQuestionItem[];

	totalMarks: number;

	publishReadiness: PublishReadiness | null;
};

export type AttachAssessmentQuestionInput = {
	questionId: string;
	marks: number;
};
export type UpdateAssessmentQuestionInput = {
	marks: number;
};

export type PublishAssessmentResult = {
	assessment: {
		id: string;
		title: string;
		status: "PUBLISHED";
		creditGrantId: string;
		creditConsumedAt: string;
		publishedAt: string;
	};

	credit: {
		grantId: string;
		source: "FREE" | "PURCHASE" | "ADMIN";
		remainingCredits: number;
		expiresAt: string | null;
	};
};

export type AssessmentListData = PaginatedData<RecruiterAssessment>;
