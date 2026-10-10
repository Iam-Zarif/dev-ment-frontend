import type { AssessmentStatus } from "@/types/assessment.types";
import type { ApplicationStatus } from "@/types/application.types";

export type RecruiterDashboard = {
	company: { name: string; isVerified: boolean };
	stats: {
		assessments: number;
		drafts: number;
		published: number;
		applications: number;
		awaitingReview: number;
		pendingEvaluations: number;
		availableCredits: number;
	};
	recentAssessments: Array<{
		id: string;
		title: string;
		status: AssessmentStatus;
		updatedAt: string;
		_count: { applications: number };
	}>;
	recentApplications: Array<{
		id: string;
		status: ApplicationStatus;
		appliedAt: string;
		candidateName: string;
		assessment: { id: string; title: string };
	}>;
};

export type CandidateDashboard = {
	stats: {
		applications: number;
		shortlisted: number;
		pendingInvitations: number;
		activeAttempts: number;
		releasedResults: number;
	};
	recentApplications: Array<{
		id: string;
		status: ApplicationStatus;
		appliedAt: string;
		assessment: {
			id: string;
			title: string;
			companyName: string;
		};
		invitation: {
			status: string;
			expiresAt: string;
			attempt: {
				id: string;
				status: string;
				expiresAt: string;
				resultReleasedAt: string | null;
			} | null;
		} | null;
	}>;
	availableAssessments: Array<{
		id: string;
		title: string;
		jobRole: string;
		difficulty: string;
		companyName: string;
	}>;
};
