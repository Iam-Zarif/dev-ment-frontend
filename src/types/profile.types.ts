import type { UserRole } from "@/types/common.types";

export type ProfileUser = {
	id: string;
	legalName: string;
	email: string;
	role: UserRole;

	status: string;
	imageUrl: string | null;

	candidateProfile: {
		id: string;
		phone: string | null;
		headline: string | null;
		bio: string | null;

		experienceYears: number | string | null;

		skills: string[];

		githubUrl: string | null;
		linkedinUrl: string | null;
		portfolioUrl: string | null;
		resumeUrl: string | null;
	} | null;

	recruiterProfile: {
		id: string;
		jobTitle: string | null;
		phone: string | null;

		company: {
			id: string;
			name: string;
			domain: string;
			websiteUrl: string | null;
			logoUrl: string | null;
			isVerified: boolean;
		};
	} | null;
};
