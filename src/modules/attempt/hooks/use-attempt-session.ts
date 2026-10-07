"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { attemptService } from "@/modules/attempt/services/attempt.service";
import type { AttemptAnswerInput, AttemptSession, ProctorEventInput } from "@/types/attempt.types";

type SaveAnswerVariables = {
	assessmentQuestionId: string;
	input: AttemptAnswerInput;
};

export function useAttemptSession(attemptId: string) {
	const queryClient = useQueryClient();

	const { user, status: authStatus } = useAuth();

	const detailKey = [...QUERY_KEYS.ATTEMPTS, attemptId] as const;

	const query = useQuery({
		queryKey: detailKey,

		queryFn: () => attemptService.getById(attemptId),

		enabled: authStatus === "authenticated" && user?.role === USER_ROLES.CANDIDATE,

		refetchOnWindowFocus: false,
	});

	const saveAnswerMutation = useMutation({
		mutationFn: ({ assessmentQuestionId, input }: SaveAnswerVariables) =>
			attemptService.saveAnswer(attemptId, assessmentQuestionId, input),

		onSuccess: (savedAnswer) => {
			queryClient.setQueryData<AttemptSession>(detailKey, (current) => {
				if (!current) {
					return current;
				}

				const existing = current.answers.some(
					(answer) => answer.assessmentQuestionId === savedAnswer.assessmentQuestionId,
				);

				return {
					...current,

					answers: existing
						? current.answers.map((answer) =>
								answer.assessmentQuestionId === savedAnswer.assessmentQuestionId
									? savedAnswer
									: answer,
							)
						: [...current.answers, savedAnswer],
				};
			});
		},
	});

	const submitMutation = useMutation({
		mutationFn: () => attemptService.submit(attemptId),

		onSuccess: (result) => {
			queryClient.setQueryData<AttemptSession>(detailKey, (current) => {
				if (!current) {
					return current;
				}

				return {
					...current,

					attempt: {
						...current.attempt,

						status: result.status,

						submittedAt: result.submittedAt,

						remainingSeconds: 0,

						canSubmit: false,
					},
				};
			});
		},
	});

	const proctorEventMutation = useMutation({
		mutationFn: (input: ProctorEventInput) => attemptService.recordProctorEvent(attemptId, input),

		onSuccess: (result) => {
			queryClient.setQueryData<AttemptSession>(detailKey, (current) => {
				if (!current) {
					return current;
				}

				return {
					...current,

					attempt: {
						...current.attempt,

						tabSwitchCount: result.tabSwitchCount,

						isSuspicious: result.isSuspicious,
					},
				};
			});
		},
	});

	return {
		proctorEventMutation,
		query,
		saveAnswerMutation,
		submitMutation,
	};
}
