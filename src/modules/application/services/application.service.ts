import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
	ApplicationCreated,
	ApplyAssessmentInput,
	CandidateApplicationDetails,
	CandidateApplicationListData,
	CandidateApplicationListParams,
} from "@/types/application.types";

async function apply(input: ApplyAssessmentInput) {
	const response = await apiClient.post<ApiResponse<ApplicationCreated>>(
		API_ENDPOINTS.applications.root,
		input,
	);

	return response.data.data;
}

async function getMine(params: CandidateApplicationListParams) {
	const response = await apiClient.get<ApiResponse<CandidateApplicationListData>>(
		API_ENDPOINTS.applications.mine,
		{
			params,
		},
	);

	return response.data.data;
}

async function getMineById(applicationId: string) {
	const response = await apiClient.get<ApiResponse<CandidateApplicationDetails>>(
		API_ENDPOINTS.applications.mineById(applicationId),
	);

	return response.data.data;
}

export const applicationService = {
	apply,
	getMine,
	getMineById,
};
