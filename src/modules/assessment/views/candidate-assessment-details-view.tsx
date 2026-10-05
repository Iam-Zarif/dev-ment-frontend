"use client";

import { Building2, Clock3, ListChecks } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/data-display/page-header";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApplyAssessmentDialog } from "@/modules/application/components/apply-assessment-dialog";
import { useCandidateAssessment } from "@/modules/assessment/hooks/use-candidate-assessment";
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

export function CandidateAssessmentDetailsView({ assessmentId }: { assessmentId: string }) {
	const [applyOpen, setApplyOpen] = useState(false);

	const { assessmentQuery, applicationQuery, existingApplication } =
		useCandidateAssessment(assessmentId);

	if (assessmentQuery.isPending || applicationQuery.isPending) {
		return <PageSkeleton />;
	}

	if (assessmentQuery.isError) {
		return (
			<ErrorState
				description={formatError(assessmentQuery.error)}
				onRetry={() => void assessmentQuery.refetch()}
			/>
		);
	}

	const assessment = assessmentQuery.data;

	const canApply = assessment.applicationOpen && !existingApplication;

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			<PageHeader
				title={assessment.title}
				description={assessment.jobRole}
				action={
					existingApplication ? (
						<Badge variant="secondary">{existingApplication.status}</Badge>
					) : (
						<Button disabled={!canApply} onClick={() => setApplyOpen(true)}>
							Apply now
						</Button>
					)
				}
			/>

			<Card>
				<CardContent className="grid gap-5 sm:grid-cols-3">
					<div className="flex items-center gap-3">
						<Building2 className="size-5 text-muted-foreground" />

						<div>
							<p className="text-xs text-muted-foreground">Company</p>

							<p className="font-medium">{assessment.company.name}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Clock3 className="size-5 text-muted-foreground" />

						<div>
							<p className="text-xs text-muted-foreground">Duration</p>

							<p className="font-medium">{assessment.durationMinutes} minutes</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<ListChecks className="size-5 text-muted-foreground" />

						<div>
							<p className="text-xs text-muted-foreground">Questions</p>

							<p className="font-medium">{assessment._count.assessmentQuestions}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-[1fr_280px]">
				<Card>
					<CardContent className="space-y-5">
						<div>
							<h2 className="font-heading text-lg font-semibold">About this assessment</h2>

							<p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
								{plainText(assessment.descriptionHtml) || "No additional description provided."}
							</p>
						</div>

						{assessment.skills.length > 0 && (
							<div>
								<h3 className="text-sm font-medium">Skills</h3>

								<div className="mt-2 flex flex-wrap gap-2">
									{assessment.skills.map((skill) => (
										<Badge key={skill} variant="secondary">
											{skill}
										</Badge>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardContent className="space-y-4 text-sm">
						<div>
							<p className="text-muted-foreground">Difficulty</p>

							<p className="font-medium">{formatEnumLabel(assessment.difficulty)}</p>
						</div>

						<div>
							<p className="text-muted-foreground">Pass score</p>

							<p className="font-medium">{assessment.passPercentage}%</p>
						</div>

						<div>
							<p className="text-muted-foreground">Application deadline</p>

							<p className="font-medium">{formatDateTime(assessment.applicationDeadline)}</p>
						</div>

						<div>
							<p className="text-muted-foreground">Opens</p>

							<p className="font-medium">{formatDateTime(assessment.opensAt)}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<ApplyAssessmentDialog
				assessmentId={assessment.id}
				open={applyOpen}
				onOpenChange={setApplyOpen}
			/>
		</div>
	);
}
