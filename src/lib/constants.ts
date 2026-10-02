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
	ATTEMPTS: ["attempts"] as const,
	EVALUATIONS: ["evaluations"] as const,
	PAYMENTS: ["payments"] as const,
	PROFILES: ["profiles"] as const,
} as const;
