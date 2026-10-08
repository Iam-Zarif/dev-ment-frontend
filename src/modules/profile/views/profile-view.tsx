"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/data-display/page-header";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";

import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { CandidateForm } from "@/modules/profile/components/candidate-profile-form";
import { RecruiterForm } from "@/modules/profile/components/recruiter-profile-form";

import { profileService } from "@/modules/profile/services/profile.service";
import { useAuthStore } from "@/store/auth.store";
import { formatError } from "@/utils/format-error";
export function ProfileView() {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: QUERY_KEYS.PROFILES,

		queryFn: profileService.getMe,
	});

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return <ErrorState description={formatError(query.error)} />;
	}

	const user = query.data;
	const onUpdated = async () => {
		await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILES });
		const updated = queryClient.getQueryData<typeof user>(QUERY_KEYS.PROFILES);
		const { accessToken, setSession } = useAuthStore.getState();
		if (updated && accessToken)
			setSession({
				user: {
					id: updated.id,
					legalName: updated.legalName,
					email: updated.email,
					role: updated.role,
					imageUrl: updated.imageUrl,
				},
				accessToken,
			});
	};

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<PageHeader
				title="Profile & settings"
				description="Keep your professional information up to date."
			/>

			{user.role === USER_ROLES.CANDIDATE ? (
				<CandidateForm user={user} onUpdated={onUpdated} />
			) : (
				<RecruiterForm user={user} onUpdated={onUpdated} />
			)}
		</div>
	);
}
