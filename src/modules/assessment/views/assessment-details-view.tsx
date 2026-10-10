"use client";

import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/data-display/page-header";
import { ROUTES } from "@/lib/constants";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AssessmentPublishPanel } from "@/modules/assessment/components/assessment-publish-panel";
import { AssessmentQuestionList } from "@/modules/assessment/components/assessment-question-list";
import { QuestionPickerDialog } from "@/modules/assessment/components/question-picker-dialog";
import { useAssessmentDetails } from "@/modules/assessment/hooks/use-assessment-details";
import type { RecruiterQuestion } from "@/types/question.types";
import { formatError } from "@/utils/format-error";

type Props = {
	assessmentId: string;
};

export function AssessmentDetailsView({ assessmentId }: Props) {
	const [pickerOpen, setPickerOpen] = useState(false);

	const {
		query,
		attachMutation,
		updateMarksMutation,
		reorderMutation,
		removeMutation,
		publishMutation,
	} = useAssessmentDetails(assessmentId);

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return (
			<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
		);
	}

	const assessment = query.data;

	const editable = assessment.status === "DRAFT" && assessment.creditConsumedAt === null;

	const handleAttach = async (question: RecruiterQuestion) => {
		try {
			await attachMutation.mutateAsync({
				questionId: question.id,

				marks: Number(question.defaultMarks),
			});

			toast.success("Question added");
		} catch (error) {
			toast.error(formatError(error));

			throw error;
		}
	};

	const handleUpdateMarks = async (assessmentQuestionId: string, marks: number) => {
		try {
			await updateMarksMutation.mutateAsync({
				assessmentQuestionId,
				marks,
			});

			toast.success("Marks updated");
		} catch (error) {
			toast.error(formatError(error));

			throw error;
		}
	};

	const handleReorder = async (assessmentQuestionIds: string[]) => {
		try {
			await reorderMutation.mutateAsync(assessmentQuestionIds);
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	const handleRemove = async (assessmentQuestionId: string) => {
		try {
			await removeMutation.mutateAsync(assessmentQuestionId);

			toast.success("Question removed");
		} catch (error) {
			toast.error(formatError(error));

			throw error;
		}
	};

	const handlePublish = async () => {
		try {
			const result = await publishMutation.mutateAsync();

			toast.success(`Assessment published. ${result.credit.remainingCredits} credits remaining.`);
		} catch (error) {
			toast.error(formatError(error));

			throw error;
		}
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title={assessment.title || "Untitled assessment"}
				action={
					editable ? (
						<div className="flex flex-wrap items-center gap-2">
							<Button asChild type="button" variant="outline">
								<Link href={ROUTES.RECRUITER_ASSESSMENT_EDIT(assessment.id)}>
									<Pencil className="size-4" />
									Edit details
								</Link>
							</Button>
							<Button type="button" onClick={() => setPickerOpen(true)}>
								<Plus className="size-4" />
								Add question
							</Button>
						</div>
					) : undefined
				}
			/>

			{editable && (
				<p className="text-sm text-muted-foreground">
					Step 4 of 4 — Add questions from your question bank, review the details,
					then publish when ready. Your draft remains editable until publishing.
				</p>
			)}

			<Card>
				<CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					<div>
						<p className="text-xs text-muted-foreground">Status</p>

						<Badge className="mt-2">{assessment.status}</Badge>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">Job role</p>

						<p className="mt-2 text-sm font-medium">{assessment.jobRole || "—"}</p>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">Duration</p>

						<p className="mt-2 text-sm font-medium">{assessment.durationMinutes} min</p>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">Total marks</p>

						<p className="mt-2 text-sm font-medium">{assessment.totalMarks}</p>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-3">
				<div>
					<div className="flex flex-wrap items-center justify-between gap-2">
							<h2 className="font-heading text-lg font-semibold">Questions</h2>
							{editable && (
								<Link href={ROUTES.RECRUITER_QUESTIONS_NEW} target="_blank"
									rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
									Create a new question ↗
								</Link>
							)}
						</div>

					<p className="text-sm text-muted-foreground">
						{assessment.assessmentQuestions.length} question
						{assessment.assessmentQuestions.length === 1 ? "" : "s"}
					</p>
				</div>

				<AssessmentQuestionList
					items={assessment.assessmentQuestions}
					editable={editable}
					removing={removeMutation.isPending}
					reordering={reorderMutation.isPending}
					updatingQuestionId={
						updateMarksMutation.isPending
							? updateMarksMutation.variables?.assessmentQuestionId
							: undefined
					}
					onUpdateMarks={handleUpdateMarks}
					onReorder={handleReorder}
					onRemove={handleRemove}
				/>
			</div>

			{assessment.status === "DRAFT" && (
				<AssessmentPublishPanel
					readiness={assessment.publishReadiness}
					publishing={publishMutation.isPending}
					onPublish={handlePublish}
				/>
			)}

			<QuestionPickerDialog
				open={pickerOpen}
				onOpenChange={setPickerOpen}
				attachedQuestionIds={assessment.assessmentQuestions.map((item) => item.questionId)}
				onAttach={handleAttach}
			/>
		</div>
	);
}
