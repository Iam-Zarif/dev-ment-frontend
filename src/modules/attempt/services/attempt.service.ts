import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
	AttemptAnswer,
	AttemptAnswerInput,
	AttemptSession,
	ProctorEventInput,
	ProctorEventResult,
	SubmitAttemptResult,
} from "@/types/attempt.types";

async function start(invitationId: string) {
	const response = await apiClient.post<ApiResponse<AttemptSession>>(API_ENDPOINTS.attempts.start, {
		invitationId,
	});

	return response.data.data;
}

async function getById(attemptId: string) {
	const response = await apiClient.get<ApiResponse<AttemptSession>>(
		API_ENDPOINTS.attempts.byId(attemptId),
	);

	return response.data.data;
}

async function saveAnswer(
	attemptId: string,
	assessmentQuestionId: string,
	input: AttemptAnswerInput,
) {
	const response = await apiClient.put<ApiResponse<AttemptAnswer>>(
		API_ENDPOINTS.attempts.answer(attemptId, assessmentQuestionId),
		input,
	);

	return response.data.data;
}

async function recordProctorEvent(attemptId: string, input: ProctorEventInput) {
	const response = await apiClient.post<ApiResponse<ProctorEventResult>>(
		API_ENDPOINTS.attempts.proctorEvents(attemptId),
		input,
	);

	return response.data.data;
}

async function submit(attemptId: string) {
	const response = await apiClient.post<ApiResponse<SubmitAttemptResult>>(
		API_ENDPOINTS.attempts.submit(attemptId),
	);

	return response.data.data;
}

export const attemptService = {
	start,
	getById,
	saveAnswer,
	recordProctorEvent,
	submit,
};
