export const INVITATION_STATUSES = ["PENDING", "ACCEPTED", "REVOKED", "EXPIRED"] as const;

export type InvitationStatus = (typeof INVITATION_STATUSES)[number];

export type InvitationCreated = {
	requested: number;
	queued: number;
	queueAccepted: boolean;

	invitations: Array<{
		id: string;
		applicationId: string;
		status: "PENDING";
		expiresAt: string;
		sentAt: string | null;
		createdAt: string;
	}>;
};

export type CandidateInvitation = {
	id: string;
	status: InvitationStatus;

	expiresAt: string;
	sentAt: string | null;
	acceptedAt: string | null;

	applicationId: string;

	assessment: {
		id: string;
		title: string;
		jobRole: string;

		descriptionHtml: string | null;
		instructionsHtml: string | null;

		skills: string[];

		difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

		status: string;
		durationMinutes: number;

		opensAt: string | null;
		closesAt: string | null;

		company: {
			id: string;
			name: string;
			logoUrl: string | null;
		};
	};
};

export type AcceptedInvitation = {
	id: string;
	status: "ACCEPTED";

	acceptedAt: string;
	applicationId: string;
	assessmentId: string;
};
