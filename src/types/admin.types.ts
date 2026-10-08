import type { PaginatedData, UserRole } from "@/types/common.types";

export type AdminDashboard = {
	users: {
		total: number;
		active: number;
		blocked: number;
		deleted: number;

		admins: number;
		recruiters: number;
		candidates: number;
	};

	companies: {
		total: number;
		verified: number;
		unverified: number;
	};

	assessments: {
		total: number;
		published: number;
	};

	attempts: {
		inProgress: number;
		submitted: number;
		finalizedEvaluations: number;
	};

	payments: {
		paid: number;
		pending: number;
	};
};

export type AdminUser = {
	id: string;
	legalName: string;
	email: string;

	role: UserRole;

	status: "ACTIVE" | "BLOCKED" | "DELETED";

	imageUrl: string | null;

	emailVerifiedAt: string | null;
	lastLoginAt: string | null;
	deletedAt: string | null;
	createdAt: string;

	candidateProfile: {
		id: string;
		headline: string | null;
		skills: string[];
	} | null;

	recruiterProfile: {
		id: string;
		jobTitle: string | null;

		company: {
			id: string;
			name: string;
			domain: string;
			isVerified: boolean;
		};
	} | null;
};

export type AdminUsersData = PaginatedData<AdminUser>;

export type AdminAuditLog = {
	id: string;

	action: string;
	entityType: string;
	entityId: string | null;

	metadata: unknown;
	ipAddress: string | null;
	createdAt: string;

	actor: {
		id: string;
		legalName: string;
		email: string;
		role: UserRole;
	} | null;
};

export type AdminAuditData = PaginatedData<AdminAuditLog>;
