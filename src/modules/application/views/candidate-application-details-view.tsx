"use client";

import { Building2, CalendarDays, Clock3, ExternalLink } from "lucide-react";

import { PageHeader } from "@/components/data-display/page-header";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationStatusBadge } from "@/modules/application/components/application-status-badge";
import { useCandidateApplication } from "@/modules/application/hooks/use-candidate-application";
import { formatEnumLabel } from "@/modules/assessment/utils/format-enum-label";
import { formatDateTime } from "@/utils/format-date";
import { formatError } from "@/utils/format-error";

function plainText(html: string | null) {
	if (!html) {
		return "";
	}

	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function CandidateApplicationDetailsView({ applicationId }: { applicationId: string }) {
	const query = useCandidateApplication(applicationId);

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return (
			<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
		);
	}

	const application = query.data;

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			<PageHeader
				title={application.assessment.title}
				description={application.assessment.jobRole}
				action={<ApplicationStatusBadge status={application.status} />}
			/>

			<Card>
				<CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					<div className="flex items-center gap-3">
						<Building2 className="size-5 text-muted-foreground" />

						<div>
							<p className="text-xs text-muted-foreground">Company</p>

							<p className="font-medium">{application.assessment.company.name}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Clock3 className="size-5 text-muted-foreground" />

						<div>
							<p className="text-xs text-muted-foreground">Duration</p>

							<p className="font-medium">{application.assessment.durationMinutes} minutes</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<CalendarDays className="size-5 text-muted-foreground" />

						<div>
							<p className="text-xs text-muted-foreground">Applied</p>

							<p className="font-medium">{formatDateTime(application.appliedAt)}</p>
						</div>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">Difficulty</p>

						<p className="mt-1 font-medium">{formatEnumLabel(application.assessment.difficulty)}</p>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-[1fr_300px]">
				<Card>
					<CardContent className="space-y-6">
						<div>
							<h2 className="font-heading text-lg font-semibold">Assessment</h2>

							<p className="mt-2 text-sm leading-6 text-muted-foreground">
								{plainText(application.assessment.descriptionHtml) ||
									"No additional description provided."}
							</p>
						</div>

						{application.coverNote && (
							<div>
								<h3 className="font-medium">Your cover note</h3>

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
						<div>
							<p className="text-muted-foreground">Application status</p>

							<div className="mt-2">
								<ApplicationStatusBadge status={application.status} />
							</div>
						</div>

						{application.invitation && (
							<>
								<div>
									<p className="text-muted-foreground">Invitation</p>

									<p className="font-medium">{application.invitation.status}</p>
								</div>

								<div>
									<p className="text-muted-foreground">Expires</p>

									<p className="font-medium">{formatDateTime(application.invitation.expiresAt)}</p>
								</div>
							</>
						)}

						{application.assessment.company.websiteUrl && (
							<a
								href={application.assessment.company.websiteUrl}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-2 text-primary hover:underline"
							>
								Company website
								<ExternalLink className="size-4" />
							</a>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
