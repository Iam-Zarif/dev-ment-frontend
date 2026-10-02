export const API_ENDPOINTS = {
	auth: {
		login: "/auth/login",
		registerCandidate: "/auth/register/candidate",
		registerRecruiter: "/auth/register/recruiter",
		verifyOtp: "/auth/verify-otp",
		resendOtp: "/auth/resend-otp",
		refresh: "/auth/refresh",
		logout: "/auth/logout",
		me: "/auth/me",
		google: "/auth/google",
		forgotPassword: "/auth/forgot-password",
		resetPassword: "/auth/reset-password",
	},

	assessments: {
		root: "/assessments",
		draft: "/assessments/draft",
		byId: (id: string) => `/assessments/${id}`,
		draftById: (id: string) => `/assessments/${id}/draft`,
		publish: (id: string) => `/assessments/${id}/publish`,
	},

	questions: {
		root: "/questions",
		byId: (id: string) => `/questions/${id}`,
	},

	applications: {
		root: "/applications",
		byId: (id: string) => `/applications/${id}`,
	},

	invitations: {
		root: "/invitations",
	},

	attempts: {
		root: "/attempts",
		byId: (id: string) => `/attempts/${id}`,
	},

	evaluations: {
		root: "/evaluations",
		byId: (id: string) => `/evaluations/${id}`,
	},

	payments: {
		root: "/payments",
	},

	profiles: {
		root: "/profiles",
	},

	admin: {
		root: "/admin",
	},
} as const;