"use client";

import { ExternalLink, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/data-display/page-header";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationStatusBadge } from "@/modules/application/components/application-status-badge";
import { RecruiterApplicationActions } from "@/modules/application/components/recruiter-application-actions";
import { useRecruiterApplication } from "@/modules/application/hooks/use-recruiter-application";
import { formatDateTime } from "@/utils/format-date";
import { formatError } from "@/utils/format-error";

type RecruiterApplicationDetailsViewProps = {
	applicationId: string;
};

export function RecruiterApplicationDetailsView({
	applicationId,
}: RecruiterApplicationDetailsViewProps) {
	const { query, shortlistMutation, rejectMutation, inviteMutation } =
		useRecruiterApplication(applicationId);

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return (
			<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
		);
	}

	const application = query.data;
	const candidate = application.candidate;

	const handleShortlist = async () => {
		try {
			await shortlistMutation.mutateAsync();

			toast.success("Candidate shortlisted");
		} catch (error) {
			toast.error(formatError(error));
			throw error;
		}
	};

	const handleReject = async (reason?: string) => {
		try {
			await rejectMutation.mutateAsync({
				rejectionReason: reason,
			});

			toast.success("Application rejected");
		} catch (error) {
			toast.error(formatError(error));
			throw error;
		}
	};

	const handleInvite = async () => {
		try {
			const result = await inviteMutation.mutateAsync();

			toast.success(result.queueAccepted ? "Invitation queued for delivery" : "Invitation created");
		} catch (error) {
			toast.error(formatError(error));
			throw error;
		}
	};

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6">
			<PageHeader
				title={candidate.user.legalName}
				description={application.assessment.title}
				action={<ApplicationStatusBadge status={application.status} />}
			/>

			<RecruiterApplicationActions
				status={application.status}
				shortlisting={shortlistMutation.isPending}
				rejecting={rejectMutation.isPending}
				inviting={inviteMutation.isPending}
				onShortlist={handleShortlist}
				onReject={handleReject}
				onInvite={handleInvite}
			/>

			<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
				<Card>
					<CardContent className="space-y-6">
						<div>
							<h2 className="font-heading text-lg font-semibold">Candidate profile</h2>

							{candidate.headline && (
								<p className="mt-2 text-sm font-medium">{candidate.headline}</p>
							)}

							{candidate.bio && (
								<p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
									{candidate.bio}
								</p>
							)}
						</div>

						{candidate.skills.length > 0 && (
							<div>
								<h3 className="font-medium">Skills</h3>

								<p className="mt-2 text-sm text-muted-foreground">{candidate.skills.join(", ")}</p>
							</div>
						)}

						{application.coverNote && (
							<div>
								<h3 className="font-medium">Cover note</h3>

								<p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
									{application.coverNote}
								</p>
							</div>
						)}

						{application.rejectionReason && (
							<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
								<h3 className="font-medium text-destructive">Rejection reason</h3>

								<p className="mt-2 text-sm text-muted-foreground">{application.rejectionReason}</p>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardContent className="space-y-4 text-sm">
						<div className="flex items-center gap-2">
							<Mail className="size-4 text-muted-foreground" />

							<span>{candidate.user.email}</span>
						</div>

						{candidate.phone && (
							<div className="flex items-center gap-2">
								<Phone className="size-4 text-muted-foreground" />

								<span>{candidate.phone}</span>
							</div>
						)}

						<div>
							<p className="text-muted-foreground">Experience</p>

							<p className="font-medium">
								{candidate.experienceYears !== null ? `${candidate.experienceYears} years` : "—"}
							</p>
						</div>

						<div>
							<p className="text-muted-foreground">Applied</p>

							<p className="font-medium">{formatDateTime(application.appliedAt)}</p>
						</div>

						{application.invitation && (
							<div>
								<p className="text-muted-foreground">Invitation</p>

								<p className="font-medium">{application.invitation.status}</p>

								<p className="mt-1 text-xs text-muted-foreground">
									Expires {formatDateTime(application.invitation.expiresAt)}
								</p>
							</div>
						)}

						{candidate.resumeUrl && (
							<a
								href={candidate.resumeUrl}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-2 text-primary hover:underline"
							>
								View resume
								<ExternalLink className="size-4" />
							</a>
						)}

						{candidate.githubUrl && (
							<a
								href={candidate.githubUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-2 text-primary hover:underline"
							>
								GitHub
								<ExternalLink className="size-4" />
							</a>
						)}

						{candidate.linkedinUrl && (
							<a
								href={candidate.linkedinUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-2 text-primary hover:underline"
							>
								LinkedIn
								<ExternalLink className="size-4" />
							</a>
						)}

						{candidate.portfolioUrl && (
							<a
								href={candidate.portfolioUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-2 text-primary hover:underline"
							>
								Portfolio
								<ExternalLink className="size-4" />
							</a>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
