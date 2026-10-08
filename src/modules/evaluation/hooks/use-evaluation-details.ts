"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QUERY_KEYS } from "@/lib/constants";
import { evaluationService } from "@/modules/evaluation/services/evaluation.service";
import type { ManualEvaluationInput } from "@/types/evaluation.types";
export function useEvaluationDetails(attemptId: string) {
	const queryClient = useQueryClient();

	const [finalFeedback, setFinalFeedback] = useState("");

	const [releaseOpen, setReleaseOpen] = useState(false);

	const detailKey = [...QUERY_KEYS.EVALUATIONS, attemptId] as const;

	const query = useQuery({
		queryKey: detailKey,

		queryFn: () => evaluationService.getById(attemptId),
	});

	const refresh = async () => {
		await queryClient.invalidateQueries({
			queryKey: QUERY_KEYS.EVALUATIONS,
		});
	};

	const reviewMutation = useMutation({
		mutationFn: ({ questionId, input }: { questionId: string; input: ManualEvaluationInput }) =>
			evaluationService.reviewAnswer(attemptId, questionId, input),

		onSuccess: refresh,
	});

	const evaluateMutation = useMutation({
		mutationFn: () => evaluationService.evaluate(attemptId),

		onSuccess: refresh,
	});

	const finalizeMutation = useMutation({
		mutationFn: () =>
			evaluationService.finalize(attemptId, {
				finalFeedback: finalFeedback.trim() || null,
			}),

		onSuccess: refresh,
	});

	const releaseMutation = useMutation({
		mutationFn: () => evaluationService.release(attemptId),

		onSuccess: refresh,
	});

	return {
		query,
		finalFeedback,
		setFinalFeedback,
		releaseOpen,
		setReleaseOpen,
		reviewMutation,
		evaluateMutation,
		finalizeMutation,
		releaseMutation,
	};
}
