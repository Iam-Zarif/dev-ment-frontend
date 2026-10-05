import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
	AssessmentDetails,
	AssessmentDraftResult,
	AssessmentListData,
	AssessmentListParams,
	AssessmentQuestionItem,
	AttachAssessmentQuestionInput,
	CreateAssessmentDraftInput,
	PublishAssessmentResult,
	UpdateAssessmentQuestionInput,
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

async function getById(id: string) {
	const response = await apiClient.get<ApiResponse<AssessmentDetails>>(
		API_ENDPOINTS.assessments.byId(id),
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

async function addQuestion(assessmentId: string, input: AttachAssessmentQuestionInput) {
	const response = await apiClient.post<ApiResponse<AssessmentQuestionItem>>(
		API_ENDPOINTS.assessments.questions(assessmentId),
		input,
	);

	return response.data.data;
}

async function updateQuestion(
	assessmentId: string,
	assessmentQuestionId: string,
	input: UpdateAssessmentQuestionInput,
) {
	await apiClient.patch<ApiResponse<unknown>>(
		API_ENDPOINTS.assessments.questionById(assessmentId, assessmentQuestionId),
		input,
	);
}

async function reorderQuestions(assessmentId: string, assessmentQuestionIds: string[]) {
	await apiClient.patch<ApiResponse<unknown>>(
		API_ENDPOINTS.assessments.questionOrder(assessmentId),
		{
			assessmentQuestionIds,
		},
	);
}

async function removeQuestion(assessmentId: string, assessmentQuestionId: string) {
	const response = await apiClient.delete<
		ApiResponse<{
			id: string;
		}>
	>(API_ENDPOINTS.assessments.questionById(assessmentId, assessmentQuestionId));

	return response.data.data;
}

async function publish(assessmentId: string) {
	const response = await apiClient.post<ApiResponse<PublishAssessmentResult>>(
		API_ENDPOINTS.assessments.publish(assessmentId),
	);

	return response.data.data;
}

export const assessmentService = {
	getAll,
	getById,
	createDraft,
	addQuestion,
	updateQuestion,
	reorderQuestions,
	removeQuestion,
	publish,
};
