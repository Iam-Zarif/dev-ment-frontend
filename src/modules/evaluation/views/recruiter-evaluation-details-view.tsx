"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/data-display/page-header";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EvaluationQuestionCard } from "@/modules/evaluation/components/evaluation-question-card";
import { useEvaluationDetails } from "@/modules/evaluation/hooks/use-evaluation-details";
import { formatError } from "@/utils/format-error";

export function RecruiterEvaluationDetailsView({ attemptId }: { attemptId: string }) {
	const {
		query,
		finalFeedback,
		setFinalFeedback,
		releaseOpen,
		setReleaseOpen,
		reviewMutation,
		evaluateMutation,
		finalizeMutation,
		releaseMutation,
	} = useEvaluationDetails(attemptId);

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return (
			<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
		);
	}

	const data = query.data;

	const locked = data.evaluationStatus === "FINALIZED";

	const run = async (action: () => Promise<unknown>, success: string) => {
		try {
			await action();
			toast.success(success);
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	return (
		<div className="mx-auto max-w-5xl space-y-6">
			<PageHeader
				title={data.assessment.title}
				description={data.candidate.user.legalName}
				action={<Badge variant="outline">{data.evaluationStatus}</Badge>}
			/>

			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent>
						<p className="text-xs text-muted-foreground">Score</p>

						<p className="mt-1 text-xl font-semibold">{data.totalScore ?? "—"}</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						<p className="text-xs text-muted-foreground">Percentage</p>

						<p className="mt-1 text-xl font-semibold">
							{data.percentage !== null ? `${data.percentage}%` : "—"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						<p className="text-xs text-muted-foreground">Tab switches</p>

						<p className="mt-1 text-xl font-semibold">{data.tabSwitchCount}</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						<p className="text-xs text-muted-foreground">Integrity</p>

						<div className="mt-2">
							{data.isSuspicious ? (
								<Badge variant="destructive">
									<AlertTriangle className="size-3" />
									Flagged
								</Badge>
							) : (
								<Badge variant="secondary">
									<CheckCircle2 className="size-3" />
									Clear
								</Badge>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-4">
				{data.assessment.questions.map((item) => (
					<EvaluationQuestionCard
						key={item.id}
						item={item}
						locked={locked}
						saving={reviewMutation.isPending}
						onSave={async (questionId, input) => {
							await run(
								() =>
									reviewMutation.mutateAsync({
										questionId,
										input,
									}),

								"Answer review saved",
							);
						}}
					/>
				))}
			</div>

			<Card>
				<CardContent className="space-y-4">
					{data.evaluationStatus !== "FINALIZED" && (
						<Button
							type="button"
							disabled={evaluateMutation.isPending}
							onClick={() =>
								void run(
									() => evaluateMutation.mutateAsync(),

									"Evaluation calculated",
								)
							}
						>
							Calculate evaluation
						</Button>
					)}

					{data.evaluationStatus === "EVALUATED" && (
						<div className="space-y-3">
							<Textarea
								value={finalFeedback}
								maxLength={5000}
								placeholder="Final feedback for the candidate"
								onChange={(event) => setFinalFeedback(event.target.value)}
							/>

							<Button
								type="button"
								disabled={finalizeMutation.isPending}
								onClick={() =>
									void run(
										() => finalizeMutation.mutateAsync(),

										"Evaluation finalized",
									)
								}
							>
								Finalize evaluation
							</Button>
						</div>
					)}

					{data.evaluationStatus === "FINALIZED" && !data.resultReleasedAt && (
						<Button type="button" onClick={() => setReleaseOpen(true)}>
							Release result
						</Button>
					)}

					{data.resultReleasedAt && <Badge>Result released</Badge>}
				</CardContent>
			</Card>

			<ConfirmDialog
				open={releaseOpen}
				onOpenChange={setReleaseOpen}
				title="Release result?"
				description="The candidate will be able to view the finalized result."
				confirmLabel="Release"
				loading={releaseMutation.isPending}
				onConfirm={async () => {
					await run(
						() => releaseMutation.mutateAsync(),

						"Result released",
					);
				}}
			/>
		</div>
	);
}
