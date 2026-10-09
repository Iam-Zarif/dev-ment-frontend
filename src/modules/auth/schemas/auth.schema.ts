import { z } from "zod";

const emailSchema = z
	.string()
	.trim()
	.email("Enter a valid email address")
	.transform((value) => value.toLowerCase());

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(72, "Password cannot exceed 72 characters");

const legalNameSchema = z
	.string()
	.trim()
	.min(2, "Name must be at least 2 characters")
	.max(150, "Name cannot exceed 150 characters");

export const loginSchema = z.object({
	email: emailSchema,
	password: z
		.string()
		.min(1, "Password is required")
		.max(72, "Password cannot exceed 72 characters"),
});

export const candidateRegistrationSchema = z
	.object({
		legalName: legalNameSchema,
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const recruiterRegistrationSchema = z
	.object({
		legalName: legalNameSchema,

		email: emailSchema,

		companyName: z
			.string()
			.trim()
			.min(2, "Company name must be at least 2 characters")
			.max(180, "Company name cannot exceed 180 characters"),

		jobTitle: z
			.string()
			.trim()
			.min(2, "Job title must be at least 2 characters")
			.max(150, "Job title cannot exceed 150 characters")
			.optional()
			.or(z.literal("")),

		password: passwordSchema,
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const verifyOtpSchema = z.object({
	email: emailSchema,

	otp: z.string().regex(/^\d{6}$/, "Verification code must contain 6 digits"),

	purpose: z.enum(["CANDIDATE_REGISTRATION", "RECRUITER_REGISTRATION", "PASSWORD_RESET"]),
});

export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

export const resetPasswordSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type CandidateRegistrationFormValues = z.infer<typeof candidateRegistrationSchema>;

export type RecruiterRegistrationFormValues = z.infer<typeof recruiterRegistrationSchema>;

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
