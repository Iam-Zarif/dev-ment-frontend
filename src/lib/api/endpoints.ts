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
		verifyPasswordResetOtp: "/auth/verify-password-reset-otp",
		resetPassword: "/auth/reset-password",
	},

	assessments: {
		root: "/assessments",
		draft: "/assessments/draft",
		published: "/assessments/published",

		publishedById: (id: string) => `/assessments/published/${id}`,

		byId: (id: string) => `/assessments/${id}`,

		draftById: (id: string) => `/assessments/${id}/draft`,

		questions: (id: string) => `/assessments/${id}/questions`,

		questionById: (id: string, assessmentQuestionId: string) =>
			`/assessments/${id}/questions/${assessmentQuestionId}`,

		questionOrder: (id: string) => `/assessments/${id}/questions/order`,

		publish: (id: string) => `/assessments/${id}/publish`,
	},

	questions: {
		root: "/questions",
		byId: (id: string) => `/questions/${id}`,
	},

	applications: {
		root: "/applications",

		mine: "/applications/me",

		mineById: (id: string) => `/applications/me/${id}`,

		recruiter: "/applications/recruiter",

		recruiterById: (id: string) => `/applications/recruiter/${id}`,

		shortlist: (id: string) => `/applications/${id}/shortlist`,

		reject: (id: string) => `/applications/${id}/reject`,
	},

	invitations: {
		root: "/invitations",
		verify: "/invitations/verify",
		accept: "/invitations/accept",

		resend: (id: string) => `/invitations/${id}/resend`,

		revoke: (id: string) => `/invitations/${id}/revoke`,
	},

	attempts: {
		start: "/attempts/start",

		byId: (id: string) => `/attempts/${id}`,

		answer: (id: string, assessmentQuestionId: string) =>
			`/attempts/${id}/answers/${assessmentQuestionId}`,

		proctorEvents: (id: string) => `/attempts/${id}/proctor-events`,

		submit: (id: string) => `/attempts/${id}/submit`,
	},

	evaluations: {
		root: "/evaluations",

		byId: (id: string) => `/evaluations/${id}`,

		question: (id: string, assessmentQuestionId: string) =>
			`/evaluations/${id}/questions/${assessmentQuestionId}`,

		evaluate: (id: string) => `/evaluations/${id}/evaluate`,

		finalize: (id: string) => `/evaluations/${id}/finalize`,

		release: (id: string) => `/evaluations/${id}/release`,

		candidateResult: (id: string) => `/evaluations/results/me/${id}`,
	},

	payments: {
		root: "/payments",

		plans: "/payments/plans",
		checkout: "/payments/checkout",
		credits: "/payments/credits",

		byId: (id: string) => `/payments/${id}`,
	},

	profiles: {
		candidate: "/profiles/candidate",

		recruiter: "/profiles/recruiter",

		uploadSignature: "/profiles/upload-signature",
	},

	admin: {
		dashboard: "/admin/dashboard",
		users: "/admin/users",

		userStatus: (id: string) => `/admin/users/${id}/status`,

		user: (id: string) => `/admin/users/${id}`,

		auditLogs: "/admin/audit-logs",

		payments: "/admin/payments",
	},
} as const;
