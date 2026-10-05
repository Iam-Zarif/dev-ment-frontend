"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { applicationService } from "@/modules/application/services/application.service";
import { assessmentService } from "@/modules/assessment/services/assessment.service";

export function useCandidateAssessment(assessmentId: string) {
	const { user, status: authStatus } = useAuth();

	const enabled = authStatus === "authenticated" && user?.role === USER_ROLES.CANDIDATE;

	const assessmentQuery = useQuery({
		queryKey: [...QUERY_KEYS.ASSESSMENTS, "published", assessmentId],

		queryFn: () => assessmentService.getPublishedById(assessmentId),

		enabled,
	});

	const applicationQuery = useQuery({
		queryKey: [...QUERY_KEYS.APPLICATIONS, "mine", assessmentId],

		queryFn: () =>
			applicationService.getMine({
				page: 1,
				limit: 1,
				assessmentId,
			}),

		enabled,
	});

	return {
		assessmentQuery,
		applicationQuery,

		existingApplication: applicationQuery.data?.items[0],
	};
}
