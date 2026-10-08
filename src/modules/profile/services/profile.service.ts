import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type { ProfileUser } from "@/types/profile.types";

async function getMe() {
	const response = await apiClient.get<ApiResponse<ProfileUser>>(API_ENDPOINTS.auth.me);

	return response.data.data;
}

async function updateCandidate(input: Record<string, unknown>) {
	const response = await apiClient.patch<ApiResponse<ProfileUser>>(
		API_ENDPOINTS.profiles.candidate,
		input,
	);

	return response.data.data;
}

async function updateRecruiter(input: Record<string, unknown>) {
	const response = await apiClient.patch<ApiResponse<ProfileUser>>(
		API_ENDPOINTS.profiles.recruiter,
		input,
	);

	return response.data.data;
}

export const profileService = {
	getMe,
	updateCandidate,
	updateRecruiter,
};
