"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { assessmentService } from "@/modules/assessment/services/assessment.service";

export function useAssessmentDetails(assessmentId: string) {
	const queryClient = useQueryClient();

	const { user, status: authStatus } = useAuth();

	const query = useQuery({
		queryKey: [...QUERY_KEYS.ASSESSMENTS, assessmentId],

		queryFn: () => assessmentService.getById(assessmentId),

		enabled: authStatus === "authenticated" && user?.role === USER_ROLES.RECRUITER,
	});

	const invalidateAssessment = async () => {
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: [...QUERY_KEYS.ASSESSMENTS, assessmentId],
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

	const removeMutation = useMutation({
		mutationFn: (assessmentQuestionId: string) =>
			assessmentService.removeQuestion(assessmentId, assessmentQuestionId),

		onSuccess: invalidateAssessment,
	});

	return {
		query,
		attachMutation,
		removeMutation,
	};
}
