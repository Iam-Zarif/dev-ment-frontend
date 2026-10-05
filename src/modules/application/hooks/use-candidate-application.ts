"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { applicationService } from "@/modules/application/services/application.service";

export function useCandidateApplication(applicationId: string) {
	const { user, status: authStatus } = useAuth();

	return useQuery({
		queryKey: [...QUERY_KEYS.APPLICATIONS, "mine", applicationId],

		queryFn: () => applicationService.getMineById(applicationId),

		enabled: authStatus === "authenticated" && user?.role === USER_ROLES.CANDIDATE,
	});
}
