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

export type RecruiterApplication = {
	id: string;
	status: ApplicationStatus;

	coverNote: string | null;
	rejectionReason: string | null;
	reviewedAt: string | null;
	appliedAt: string;

	candidate: {
		id: string;
		headline: string | null;
		experienceYears: number | null;
		skills: string[];
		resumeUrl: string | null;

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
		status: string;
	};
};

export type RecruiterApplicationDetails = RecruiterApplication & {
	updatedAt: string;

	candidate: RecruiterApplication["candidate"] & {
		phone: string | null;
		bio: string | null;

		githubUrl: string | null;
		linkedinUrl: string | null;
		portfolioUrl: string | null;
	};

	invitation: {
		id: string;
		status: string;
		expiresAt: string;
		sentAt: string | null;
		acceptedAt: string | null;
	} | null;
};

export type RecruiterApplicationListParams = {
	page: number;
	limit: number;

	search?: string;
	status?: ApplicationStatus;
	assessmentId?: string;
};

export type RecruiterApplicationListData = PaginatedData<RecruiterApplication>;

export type ApplicationDecisionResult = {
	id: string;
	status: ApplicationStatus;
	reviewedAt: string | null;
	rejectionReason: string | null;
};

export type RejectApplicationInput = {
	rejectionReason?: string;
};

export type CandidateApplicationListData = PaginatedData<CandidateApplication>;
