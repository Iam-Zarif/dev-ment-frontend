"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { applicationService } from "@/modules/application/services/application.service";
import { invitationService } from "@/modules/invitation/services/invitation.service";
import type { RejectApplicationInput } from "@/types/application.types";

export function useRecruiterApplication(applicationId: string) {
	const queryClient = useQueryClient();

	const { user, status: authStatus } = useAuth();

	const detailKey = [...QUERY_KEYS.APPLICATIONS, "recruiter", applicationId] as const;

	const query = useQuery({
		queryKey: detailKey,

		queryFn: () => applicationService.getRecruiterById(applicationId),

		enabled: authStatus === "authenticated" && user?.role === USER_ROLES.RECRUITER,
	});

	const invalidate = async () => {
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.APPLICATIONS,
			}),

			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.INVITATIONS,
			}),
		]);
	};

	const shortlistMutation = useMutation({
		mutationFn: () => applicationService.shortlist(applicationId),

		onSuccess: invalidate,
	});

	const rejectMutation = useMutation({
		mutationFn: (input: RejectApplicationInput) => applicationService.reject(applicationId, input),

		onSuccess: invalidate,
	});

	const inviteMutation = useMutation({
		mutationFn: () => invitationService.create(applicationId),

		onSuccess: invalidate,
	});

	return {
		query,
		shortlistMutation,
		rejectMutation,
		inviteMutation,
	};
}
