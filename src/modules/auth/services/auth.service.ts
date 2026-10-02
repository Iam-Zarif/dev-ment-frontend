import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
	ApiResponse,
} from "@/types/api.types";
import type {
	AuthSessionData,
	AuthUser,
	CandidateRegistrationInput,
	ForgotPasswordInput,
	LoginInput,
	RecruiterRegistrationInput,
	RegistrationResult,
	ResendOtpInput,
	ResetPasswordInput,
	VerifyOtpInput,
} from "@/types/auth.types";

async function login(
	input: LoginInput,
) {
	const response =
		await apiClient.post<
			ApiResponse<AuthSessionData>
		>(
			API_ENDPOINTS.auth.login,
			input,
		);

	return response.data;
}

async function registerCandidate(
	input: CandidateRegistrationInput,
) {
	const response =
		await apiClient.post<
			ApiResponse<RegistrationResult>
		>(
			API_ENDPOINTS.auth
				.registerCandidate,
			input,
		);

	return response.data;
}

async function registerRecruiter(
	input: RecruiterRegistrationInput,
) {
	const payload = {
		...input,
		jobTitle:
			input.jobTitle?.trim() ||
			undefined,
	};

	const response =
		await apiClient.post<
			ApiResponse<RegistrationResult>
		>(
			API_ENDPOINTS.auth
				.registerRecruiter,
			payload,
		);

	return response.data;
}

async function verifyOtp(
	input: VerifyOtpInput,
) {
	const response =
		await apiClient.post<
			ApiResponse<AuthSessionData>
		>(
			API_ENDPOINTS.auth
				.verifyOtp,
			input,
		);

	return response.data;
}

async function resendOtp(
	input: ResendOtpInput,
) {
	const response =
		await apiClient.post<
			ApiResponse<RegistrationResult>
		>(
			API_ENDPOINTS.auth
				.resendOtp,
			input,
		);

	return response.data;
}

async function refresh() {
	const response =
		await apiClient.post<
			ApiResponse<AuthSessionData>
		>(
			API_ENDPOINTS.auth.refresh,
		);

	return response.data;
}

async function getMe() {
	const response =
		await apiClient.get<
			ApiResponse<AuthUser>
		>(
			API_ENDPOINTS.auth.me,
		);

	return response.data;
}

async function logout() {
	const response =
		await apiClient.post<
			ApiResponse<null>
		>(
			API_ENDPOINTS.auth.logout,
		);

	return response.data;
}

async function forgotPassword(
	input: ForgotPasswordInput,
) {
	const response =
		await apiClient.post<
			ApiResponse<null>
		>(
			API_ENDPOINTS.auth
				.forgotPassword,
			input,
		);

	return response.data;
}

async function resetPassword(
	input: ResetPasswordInput,
) {
	const response =
		await apiClient.post<
			ApiResponse<null>
		>(
			API_ENDPOINTS.auth
				.resetPassword,
			input,
		);

	return response.data;
}

export const authService = {
	login,
	registerCandidate,
	registerRecruiter,
	verifyOtp,
	resendOtp,
	refresh,
	getMe,
	logout,
	forgotPassword,
	resetPassword,
};