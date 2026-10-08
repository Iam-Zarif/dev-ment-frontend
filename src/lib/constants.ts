export const USER_ROLES = {
	ADMIN: "ADMIN",
	RECRUITER: "RECRUITER",
	CANDIDATE: "CANDIDATE",
} as const;

export const ROUTES = {
	HOME: "/",

	ABOUT: "/about",
	FEATURES: "/features",
	PRICING: "/pricing",
	FAQ: "/faq",

	LOGIN: "/login",
	REGISTER: "/register",

	FORGOT_PASSWORD: "/forgot-password",

	RESET_PASSWORD: "/reset-password",

	VERIFY_OTP: "/verify-otp",

	INVITATIONS: "/invitations",

	PAYMENT_SUCCESS: "/payment/success",

	PAYMENT_CANCEL: "/payment/cancel",

	ADMIN: "/admin",

	ADMIN_USERS: "/admin/users",

	ADMIN_REPORTS: "/admin/reports",

	RECRUITER: "/recruiter",

	RECRUITER_ASSESSMENTS: "/recruiter/assessments",

	RECRUITER_ASSESSMENTS_NEW: "/recruiter/assessments/new",

	RECRUITER_ASSESSMENT: (id: string) => `/recruiter/assessments/${id}`,

	RECRUITER_QUESTIONS: "/recruiter/questions",

	RECRUITER_QUESTIONS_NEW: "/recruiter/questions/new",

	RECRUITER_APPLICATIONS: "/recruiter/applications",

	RECRUITER_APPLICATION: (id: string) => `/recruiter/applications/${id}`,

	RECRUITER_EVALUATIONS: "/recruiter/evaluations",

	RECRUITER_EVALUATION: (id: string) => `/recruiter/evaluations/${id}`,

	RECRUITER_BILLING: "/recruiter/billing",

	RECRUITER_PROFILE: "/recruiter/profile",

	CANDIDATE: "/candidate",

	CANDIDATE_ASSESSMENTS: "/candidate/assessments",

	CANDIDATE_ASSESSMENT: (id: string) => `/candidate/assessments/${id}`,

	CANDIDATE_APPLICATIONS: "/candidate/applications",

	CANDIDATE_APPLICATION: (id: string) => `/candidate/applications/${id}`,

	CANDIDATE_ATTEMPT: (id: string) => `/candidate/attempts/${id}`,

	CANDIDATE_RESULT: (id: string) => `/candidate/results/${id}`,

	CANDIDATE_PROFILE: "/candidate/profile",
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

	ADMIN: ["admin"] as const,
} as const;
