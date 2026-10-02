import type { UserRole } from "@/types/common.types";

export type AuthUser = {
	id: string;
	legalName: string;
	email: string;
	role: UserRole;
	imageUrl: string | null;
};

export type AuthSessionData = {
	user: AuthUser;
	accessToken: string;
};

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export type OtpPurpose = "CANDIDATE_REGISTRATION" | "RECRUITER_REGISTRATION";

export type LoginInput = {
	email: string;
	password: string;
};

export type CandidateRegistrationInput = {
	legalName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type RecruiterRegistrationInput = {
	legalName: string;
	email: string;
	companyName: string;
	jobTitle?: string;
	password: string;
	confirmPassword: string;
};

export type RegistrationResult = {
	email: string;
	expiresInSeconds: number;
	companyDomain?: string;
};

export type VerifyOtpInput = {
	email: string;
	otp: string;
	purpose: OtpPurpose;
};

export type ResendOtpInput = {
	email: string;
	purpose: OtpPurpose;
};

export type ForgotPasswordInput = {
	email: string;
};

export type ResetPasswordInput = {
	token: string;
	password: string;
	confirmPassword: string;
};
