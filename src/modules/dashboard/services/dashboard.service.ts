import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type { CandidateDashboard, RecruiterDashboard } from "@/types/dashboard.types";

const getRecruiter = async () => {
	const response = await apiClient.get<ApiResponse<RecruiterDashboard>>(API_ENDPOINTS.dashboard.recruiter);
	return response.data.data;
};

const getCandidate = async () => {
	const response = await apiClient.get<ApiResponse<CandidateDashboard>>(API_ENDPOINTS.dashboard.candidate);
	return response.data.data;
};

export const dashboardService = { getRecruiter, getCandidate };
