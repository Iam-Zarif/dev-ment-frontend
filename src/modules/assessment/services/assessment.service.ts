import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type { AssessmentListData, AssessmentListParams } from "@/types/assessment.types";

async function getAll(params: AssessmentListParams) {
	const response = await apiClient.get<ApiResponse<AssessmentListData>>(
		API_ENDPOINTS.assessments.root,
		{
			params,
		},
	);

	return response.data.data;
}

export const assessmentService = {
	getAll,
};
