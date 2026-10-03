import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
	AssessmentDraftResult,
	AssessmentListData,
	AssessmentListParams,
	CreateAssessmentDraftInput,
} from "@/types/assessment.types";

async function getAll(params: AssessmentListParams) {
	const response = await apiClient.get<ApiResponse<AssessmentListData>>(
		API_ENDPOINTS.assessments.root,
		{
			params,
		},
	);

	return response.data.data;
}

async function createDraft(input: CreateAssessmentDraftInput) {
	const response = await apiClient.post<ApiResponse<AssessmentDraftResult>>(
		API_ENDPOINTS.assessments.draft,
		input,
	);

	return response.data.data;
}

export const assessmentService = {
	getAll,
	createDraft,
};
