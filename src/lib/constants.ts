export const USER_ROLES = {
	ADMIN: "ADMIN",
	RECRUITER: "RECRUITER",
	CANDIDATE: "CANDIDATE",
} as const;

export const ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/register",

	ADMIN: "/admin",
	RECRUITER: "/recruiter",
	CANDIDATE: "/candidate",
	INVITATIONS: "/invitations",
	CANDIDATE_ASSESSMENTS: "/candidate/assessments",
	CANDIDATE_APPLICATIONS: "/candidate/applications",

	CANDIDATE_APPLICATION: (id: string) => `/candidate/applications/${id}`,

	CANDIDATE_ASSESSMENT: (id: string) => `/candidate/assessments/${id}`,
	RECRUITER_ASSESSMENT: (id: string) => `/recruiter/assessments/${id}`,
	RECRUITER_ASSESSMENTS_NEW: "/recruiter/assessments/new",
	RECRUITER_QUESTIONS: "/recruiter/questions",
	RECRUITER_QUESTIONS_NEW: "/recruiter/questions/new",
	RECRUITER_ASSESSMENTS: "/recruiter/assessments",
	RECRUITER_APPLICATIONS: "/recruiter/applications",

	RECRUITER_APPLICATION: (id: string) => `/recruiter/applications/${id}`,

	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	VERIFY_OTP: "/verify-otp",
} as const;

export const PAGINATION = {
	DEFAULT_PAGE: 1,
	DEFAULT_LIMIT: 10,
	PAGE_SIZE_OPTIONS: [10, 20, 50] as const,
} as const;

export const QUERY_KEYS = {
	AUTH: ["auth"] as const,
	ME: ["auth", "me"] as const,
	ASSESSMENTS: ["assessments"] as const,
	QUESTIONS: ["questions"] as const,
	APPLICATIONS: ["applications"] as const,
	INVITATIONS: ["invitations"] as const,
	ATTEMPTS: ["attempts"] as const,
	EVALUATIONS: ["evaluations"] as const,
	PAYMENTS: ["payments"] as const,
	PROFILES: ["profiles"] as const,
} as const;
