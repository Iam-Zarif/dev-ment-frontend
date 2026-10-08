import type { PaginatedData } from "@/types/common.types";

export type NumericValue = number | string;

export const EVALUATION_STATUSES = ["PENDING", "PARTIAL", "EVALUATED", "FINALIZED"] as const;

export type EvaluationStatus = (typeof EVALUATION_STATUSES)[number];

export type EvaluationListItem = {
	id: string;

	status: "SUBMITTED" | "AUTO_SUBMITTED";

	evaluationStatus: EvaluationStatus;

	totalScore: NumericValue | null;
	percentage: NumericValue | null;
	passed: boolean | null;

	isSuspicious: boolean;
	tabSwitchCount: number;

	submittedAt: string | null;
	finalizedAt: string | null;
	resultReleasedAt: string | null;

	invitation: {
		application: {
			candidate: {
				id: string;
				headline: string | null;

				user: {
					id: string;
					legalName: string;
					email: string;
					imageUrl: string | null;
				};
			};

			assessment: {
				id: string;
				title: string;
				jobRole: string;
			};
		};
	};
};

export type EvaluationListParams = {
	page: number;
	limit: number;

	search?: string;
	status?: EvaluationStatus;
	isSuspicious?: boolean;
};

export type EvaluationListData = PaginatedData<EvaluationListItem>;

export type EvaluationAnswer = {
	id: string;
	answerText: string | null;
	codeAnswer: string | null;
	language: string | null;

	autoScore: NumericValue | null;
	manualScore: NumericValue | null;
	finalScore: NumericValue | null;

	recruiterFeedback: string | null;
	evaluatedAt: string | null;

	selectedOptions: Array<{
		optionId: string;
	}>;
};

export type EvaluationQuestion = {
	id: string;
	sortOrder: number;
	marks: NumericValue;

	question: {
		id: string;

		type: "MCQ" | "SHORT_TEXT" | "LONG_TEXT" | "CODING";

		contentHtml: string;
		evaluationRubric: string | null;

		selectionMode: "SINGLE" | "MULTIPLE" | null;

		allowedLanguages: string[];

		options: Array<{
			id: string;
			optionHtml: string;
			isCorrect: boolean;
			sortOrder: number;
		}>;

		codingTestCases: Array<{
			id: string;
			inputText: string;
			expectedOutput: string;
			isHidden: boolean;
			weight: NumericValue;
			sortOrder: number;
		}>;
	};

	answer: EvaluationAnswer | null;
};

export type EvaluationDetail = {
	id: string;

	status: "SUBMITTED" | "AUTO_SUBMITTED";

	evaluationStatus: EvaluationStatus;

	totalScore: NumericValue | null;
	percentage: NumericValue | null;
	passed: boolean | null;

	finalFeedback: string | null;

	isSuspicious: boolean;
	tabSwitchCount: number;

	submittedAt: string | null;
	finalizedAt: string | null;
	resultReleasedAt: string | null;

	proctorEvents: Array<{
		id: string;
		clientEventId: string;

		eventType: "TAB_HIDDEN" | "WINDOW_BLUR" | "FULLSCREEN_EXIT";

		occurredAt: string;
		metadata: unknown;
	}>;

	candidate: {
		id: string;
		phone: string | null;
		headline: string | null;
		experienceYears: NumericValue | null;
		skills: string[];

		user: {
			id: string;
			legalName: string;
			email: string;
			imageUrl: string | null;
		};
	};

	assessment: {
		id: string;
		title: string;
		jobRole: string;

		passPercentage: NumericValue;

		questions: EvaluationQuestion[];
	};
};

export type CandidateResult = {
	attemptId: string;

	status: "SUBMITTED" | "AUTO_SUBMITTED";

	totalScore: NumericValue;
	totalMarks: NumericValue;
	percentage: NumericValue;
	passed: boolean;

	finalFeedback: string | null;

	finalizedAt: string;
	resultReleasedAt: string;

	assessment: {
		id: string;
		title: string;
		jobRole: string;
		passPercentage: NumericValue;

		company: {
			id: string;
			name: string;
			logoUrl: string | null;
		};
	};

	questions: Array<{
		assessmentQuestionId: string;
		sortOrder: number;

		type: "MCQ" | "SHORT_TEXT" | "LONG_TEXT" | "CODING";

		contentHtml: string;

		marks: NumericValue;
		score: NumericValue;
		feedback: string | null;
	}>;
};

export type ManualEvaluationInput = {
	manualScore: number;
	recruiterFeedback?: string | null;
};

export type FinalizeEvaluationInput = {
	finalFeedback?: string | null;
};
