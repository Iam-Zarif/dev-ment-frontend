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
