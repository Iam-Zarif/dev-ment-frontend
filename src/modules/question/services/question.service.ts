import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type { QuestionListData, QuestionListParams } from "@/types/question.types";

async function getAll(params: QuestionListParams) {
	const response = await apiClient.get<ApiResponse<QuestionListData>>(
		API_ENDPOINTS.questions.root,
		{
			params,
		},
	);

	return response.data.data;
}

export const questionService = {
	getAll,
};
