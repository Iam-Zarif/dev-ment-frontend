import type { DifficultyLevel } from "@/types/assessment.types";
import type { PaginatedData } from "@/types/common.types";

export const APPLICATION_STATUSES = ["APPLIED", "SHORTLISTED", "REJECTED", "INVITED"] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ApplyAssessmentInput = {
	assessmentId: string;
	coverNote?: string | null;
};

export type ApplicationCreated = {
	id: string;
	status: ApplicationStatus;

	coverNote: string | null;
	appliedAt: string;

	assessment: {
		id: string;
		title: string;
		jobRole: string;

		company: {
			id: string;
			name: string;
		};
	};
};

export type CandidateApplication = {
	id: string;
	status: ApplicationStatus;

	coverNote: string | null;
	rejectionReason: string | null;

	reviewedAt: string | null;
	appliedAt: string;
	updatedAt: string;

	assessment: {
		id: string;
		title: string;
		jobRole: string;

		difficulty: DifficultyLevel;
		durationMinutes: number;

		applicationDeadline: string | null;
		opensAt: string | null;
		closesAt: string | null;

		company: {
			id: string;
			name: string;
			logoUrl: string | null;
		};
	};

	invitation: {
		id: string;
		status: string;
		expiresAt: string;
		sentAt: string;
		acceptedAt: string | null;
	} | null;
};

export type CandidateApplicationListParams = {
	page: number;
	limit: number;

	status?: ApplicationStatus;
	assessmentId?: string;
	search?: string;
};
export type CandidateApplicationDetails = {
	id: string;
	status: ApplicationStatus;

	coverNote: string | null;
	rejectionReason: string | null;

	reviewedAt: string | null;
	appliedAt: string;
	updatedAt: string;

	assessment: {
		id: string;
		title: string;
		jobRole: string;

		descriptionHtml: string | null;
		skills: string[];

		difficulty: DifficultyLevel;
		durationMinutes: number;

		applicationDeadline: string | null;
		opensAt: string | null;
		closesAt: string | null;

		company: {
			id: string;
			name: string;
			logoUrl: string | null;
			websiteUrl: string | null;
		};
	};

	invitation: {
		id: string;
		status: string;
		expiresAt: string;
		sentAt: string;
		acceptedAt: string | null;
	} | null;
};

export type CandidateApplicationListData = PaginatedData<CandidateApplication>;
