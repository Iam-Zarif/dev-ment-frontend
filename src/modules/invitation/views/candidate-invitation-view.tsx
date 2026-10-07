"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/data-display/page-header";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { formatEnumLabel } from "@/modules/assessment/utils/format-enum-label";
import { attemptService } from "@/modules/attempt/services/attempt.service";
import { invitationService } from "@/modules/invitation/services/invitation.service";
import { formatDateTime } from "@/utils/format-date";
import { formatError } from "@/utils/format-error";

type Props = {
	token: string;
};

function plainText(html: string | null) {
	if (!html) {
		return "";
	}

	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function CandidateInvitationView({ token }: Props) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const queryKey = [...QUERY_KEYS.INVITATIONS, "candidate", token] as const;

	const query = useQuery({
		queryKey,

		queryFn: () => invitationService.verify(token),

		retry: false,
	});

	const acceptMutation = useMutation({
		mutationFn: () => invitationService.accept(token),

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey,
				}),

				queryClient.invalidateQueries({
					queryKey: QUERY_KEYS.APPLICATIONS,
				}),
			]);
		},
	});
	const startMutation = useMutation({
		mutationFn: () => attemptService.start(invitation.id),

		onSuccess: (session) => {
			router.replace(ROUTES.CANDIDATE_ATTEMPT(session.attempt.id));

			router.refresh();
		},
	});

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return (
			<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
		);
	}

	const invitation = query.data;
	const assessment = invitation.assessment;

	const isAccepted = invitation.status === "ACCEPTED";

	const handleAccept = async () => {
		try {
			await acceptMutation.mutateAsync();

			toast.success("Invitation accepted");
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			<PageHeader
				title="Assessment invitation"
				description={assessment.company.name}
				action={
					<Badge variant={isAccepted ? "default" : "secondary"}>
						{formatEnumLabel(invitation.status)}
					</Badge>
				}
			/>

			<Card>
				<CardContent className="space-y-6">
					<div>
						<h2 className="font-heading text-xl font-semibold">{assessment.title}</h2>

						<p className="mt-1 text-sm text-muted-foreground">{assessment.jobRole}</p>
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						<div>
							<p className="text-xs text-muted-foreground">Difficulty</p>

							<p className="mt-1 font-medium">{formatEnumLabel(assessment.difficulty)}</p>
						</div>

						<div>
							<p className="text-xs text-muted-foreground">Duration</p>

							<p className="mt-1 font-medium">{assessment.durationMinutes} minutes</p>
						</div>

						<div>
							<p className="text-xs text-muted-foreground">Invitation expires</p>

							<p className="mt-1 font-medium">{formatDateTime(invitation.expiresAt)}</p>
						</div>
					</div>

					{assessment.skills.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{assessment.skills.map((skill) => (
								<Badge key={skill} variant="outline">
									{skill}
								</Badge>
							))}
						</div>
					)}

					{assessment.descriptionHtml && (
						<div>
							<h3 className="font-medium">About the assessment</h3>

							<p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
								{plainText(assessment.descriptionHtml)}
							</p>
						</div>
					)}

					{isAccepted && assessment.instructionsHtml && (
						<div className="rounded-lg border bg-muted/30 p-4">
							<h3 className="font-medium">Instructions</h3>

							<p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
								{plainText(assessment.instructionsHtml)}
							</p>
						</div>
					)}

					<div className="flex items-center gap-2 border-t pt-5 text-sm text-muted-foreground">
						<Clock3 className="size-4" />

						<span>Assessment closes {formatDateTime(assessment.closesAt)}</span>
					</div>

					{isAccepted ? (
						<div className="space-y-3">
							<div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
								<CheckCircle2 className="size-5 text-primary" />

								<span>
									Invitation accepted. The assessment timer starts when you click Start assessment.
								</span>
							</div>

							<Button
								type="button"
								size="lg"
								disabled={startMutation.isPending}
								onClick={async () => {
									try {
										await startMutation.mutateAsync();
									} catch (error) {
										toast.error(formatError(error));
									}
								}}
							>
								Start assessment
							</Button>
						</div>
					) : (
						<Button
							type="button"
							size="lg"
							disabled={acceptMutation.isPending}
							onClick={() => void handleAccept()}
						>
							Accept invitation
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
