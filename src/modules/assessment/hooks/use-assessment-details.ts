"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { assessmentService } from "@/modules/assessment/services/assessment.service";
import type { AssessmentDetails } from "@/types/assessment.types";

export function useAssessmentDetails(assessmentId: string) {
	const queryClient = useQueryClient();

	const { user, status: authStatus } = useAuth();

	const detailKey = [...QUERY_KEYS.ASSESSMENTS, assessmentId] as const;

	const query = useQuery({
		queryKey: detailKey,

		queryFn: () => assessmentService.getById(assessmentId),

		enabled: authStatus === "authenticated" && user?.role === USER_ROLES.RECRUITER,
	});

	const invalidateAssessment = async () => {
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: detailKey,
			}),

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.ASSESSMENTS,
			}),
		]);
	};

	const attachMutation = useMutation({
		mutationFn: ({ questionId, marks }: { questionId: string; marks: number }) =>
			assessmentService.addQuestion(assessmentId, {
				questionId,
				marks,
			}),

		onSuccess: invalidateAssessment,
	});

	const updateMarksMutation = useMutation({
		mutationFn: ({
			assessmentQuestionId,
			marks,
		}: {
			assessmentQuestionId: string;
			marks: number;
		}) =>
			assessmentService.updateQuestion(assessmentId, assessmentQuestionId, {
				marks,
			}),

		onSuccess: invalidateAssessment,
	});

	const reorderMutation = useMutation({
		mutationFn: (assessmentQuestionIds: string[]) =>
			assessmentService.reorderQuestions(assessmentId, assessmentQuestionIds),

		onMutate: async (assessmentQuestionIds) => {
			await queryClient.cancelQueries({
				queryKey: detailKey,
			});

			const previous = queryClient.getQueryData<AssessmentDetails>(detailKey);

			if (previous) {
				const byId = new Map(previous.assessmentQuestions.map((item) => [item.id, item]));

				const reordered = assessmentQuestionIds.flatMap((id, index) => {
					const item = byId.get(id);

					if (!item) {
						return [];
					}

					return [
						{
							...item,
							sortOrder: index + 1,
						},
					];
				});

				if (reordered.length === previous.assessmentQuestions.length) {
					queryClient.setQueryData<AssessmentDetails>(detailKey, {
						...previous,
						assessmentQuestions: reordered,
					});
				}
			}

			return {
				previous,
			};
		},

		onError: (_error, _ids, context) => {
			if (context?.previous) {
				queryClient.setQueryData(detailKey, context.previous);
			}
		},

		onSettled: () => invalidateAssessment(),
	});

	const removeMutation = useMutation({
		mutationFn: (assessmentQuestionId: string) =>
			assessmentService.removeQuestion(assessmentId, assessmentQuestionId),

		onSuccess: invalidateAssessment,
	});

	const publishMutation = useMutation({
		mutationFn: () => assessmentService.publish(assessmentId),

		onSuccess: invalidateAssessment,
	});

	return {
		query,
		attachMutation,
		updateMarksMutation,
		reorderMutation,
		removeMutation,
		publishMutation,
	};
}
