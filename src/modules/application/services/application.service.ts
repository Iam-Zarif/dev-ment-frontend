import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
	ApplicationCreated,
	ApplicationDecisionResult,
	ApplyAssessmentInput,
	CandidateApplicationDetails,
	CandidateApplicationListData,
	CandidateApplicationListParams,
	RecruiterApplicationDetails,
	RecruiterApplicationListData,
	RecruiterApplicationListParams,
	RejectApplicationInput,
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

async function getRecruiter(params: RecruiterApplicationListParams) {
	const response = await apiClient.get<ApiResponse<RecruiterApplicationListData>>(
		API_ENDPOINTS.applications.recruiter,
		{
			params,
		},
	);

	return response.data.data;
}

async function getRecruiterById(applicationId: string) {
	const response = await apiClient.get<ApiResponse<RecruiterApplicationDetails>>(
		API_ENDPOINTS.applications.recruiterById(applicationId),
	);

	return response.data.data;
}

async function shortlist(applicationId: string) {
	const response = await apiClient.post<ApiResponse<ApplicationDecisionResult>>(
		API_ENDPOINTS.applications.shortlist(applicationId),
	);

	return response.data.data;
}

async function reject(applicationId: string, input: RejectApplicationInput) {
	const response = await apiClient.post<ApiResponse<ApplicationDecisionResult>>(
		API_ENDPOINTS.applications.reject(applicationId),
		input,
	);

	return response.data.data;
}

export const applicationService = {
	apply,
	getMine,
	getMineById,

	getRecruiter,
	getRecruiterById,

	shortlist,
	reject,
};
