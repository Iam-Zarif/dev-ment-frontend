import type { DifficultyLevel } from "@/types/assessment.types";

export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "AUTO_SUBMITTED" | "EXPIRED";

type AttemptQuestionBase = {
	assessmentQuestionId: string;
	questionId: string;

	contentHtml: string;
	difficulty: DifficultyLevel;

	marks: number;
	sortOrder: number;
};

export type AttemptMcqQuestion = AttemptQuestionBase & {
	type: "MCQ";

	selectionMode: "SINGLE" | "MULTIPLE" | null;

	options: Array<{
		id: string;
		optionHtml: string;
		sortOrder: number;
	}>;
};

export type AttemptTextQuestion = AttemptQuestionBase &
	(
		| {
				type: "SHORT_TEXT";
		  }
		| {
				type: "LONG_TEXT";
		  }
	);

export type AttemptCodingQuestion = AttemptQuestionBase & {
	type: "CODING";

	allowedLanguages: string[];

	starterCode: unknown;

	timeLimitMs: number | null;
	memoryLimitKb: number | null;
};

export type AttemptQuestion = AttemptMcqQuestion | AttemptTextQuestion | AttemptCodingQuestion;

export type AttemptAnswer = {
	id: string;

	assessmentQuestionId: string;

	answerText: string | null;
	codeAnswer: string | null;
	language: string | null;

	selectedOptionIds: string[];

	lastSavedAt: string | null;
};

export type AttemptAnswerInput =
	| {
			selectedOptionIds: string[];
	  }
	| {
			answerText: string;
	  }
	| {
			codeAnswer: string;
			language: string;
	  };

export type SubmitAttemptResult = {
	id: string;

	status: "SUBMITTED" | "AUTO_SUBMITTED";

	submittedAt: string;
};

export type AttemptSession = {
	attempt: {
		id: string;
		status: AttemptStatus;

		startedAt: string;
		expiresAt: string;

		submittedAt: string | null;

		serverNow: string;

		isSuspicious: boolean;
		tabSwitchCount: number;

		remainingSeconds: number;
		canSubmit: boolean;
	};

	invitationId: string;
	applicationId: string;

	assessment: {
		id: string;
		title: string;
		jobRole: string;

		instructionsHtml: string | null;

		durationMinutes: number;

		opensAt: string | null;
		closesAt: string | null;

		company: {
			id: string;
			name: string;
			logoUrl: string | null;
		};
	};

	questions: AttemptQuestion[];
	answers: AttemptAnswer[];
};

export type AttemptAnswerFieldProps<Question extends AttemptQuestion = AttemptQuestion> = {
	question: Question;

	answer?: AttemptAnswer;

	saving: boolean;

	onSave: (input: AttemptAnswerInput) => Promise<void>;
};
