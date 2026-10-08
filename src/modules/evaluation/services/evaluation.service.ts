import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
	CandidateResult,
	EvaluationDetail,
	EvaluationListData,
	EvaluationListParams,
	FinalizeEvaluationInput,
	ManualEvaluationInput,
} from "@/types/evaluation.types";

async function getAll(params: EvaluationListParams) {
	const response = await apiClient.get<ApiResponse<EvaluationListData>>(
		API_ENDPOINTS.evaluations.root,
		{
			params,
		},
	);

	return response.data.data;
}

async function getById(id: string) {
	const response = await apiClient.get<ApiResponse<EvaluationDetail>>(
		API_ENDPOINTS.evaluations.byId(id),
	);

	return response.data.data;
}

async function reviewAnswer(
	id: string,
	assessmentQuestionId: string,
	input: ManualEvaluationInput,
) {
	const response = await apiClient.patch(
		API_ENDPOINTS.evaluations.question(id, assessmentQuestionId),
		input,
	);

	return response.data.data;
}

async function evaluate(id: string) {
	const response = await apiClient.post(API_ENDPOINTS.evaluations.evaluate(id));

	return response.data.data;
}

async function finalize(id: string, input: FinalizeEvaluationInput) {
	const response = await apiClient.post(API_ENDPOINTS.evaluations.finalize(id), input);

	return response.data.data;
}

async function release(id: string) {
	const response = await apiClient.post(API_ENDPOINTS.evaluations.release(id));

	return response.data.data;
}

async function getCandidateResult(attemptId: string) {
	const response = await apiClient.get<ApiResponse<CandidateResult>>(
		API_ENDPOINTS.evaluations.candidateResult(attemptId),
	);

	return response.data.data;
}

export const evaluationService = {
	getAll,
	getById,
	reviewAnswer,
	evaluate,
	finalize,
	release,
	getCandidateResult,
};
