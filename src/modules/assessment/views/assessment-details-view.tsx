"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/data-display/page-header";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

	const { query, attachMutation, removeMutation } = useAssessmentDetails(assessmentId);

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

	const handleRemove = async (assessmentQuestionId: string) => {
		try {
			await removeMutation.mutateAsync(assessmentQuestionId);

			toast.success("Question removed");
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
						<Button type="button" onClick={() => setPickerOpen(true)}>
							<Plus className="size-4" />
							Add question
						</Button>
					) : undefined
				}
			/>

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
					<h2 className="font-heading text-lg font-semibold">Questions</h2>

					<p className="text-sm text-muted-foreground">
						{assessment.assessmentQuestions.length} question
						{assessment.assessmentQuestions.length === 1 ? "" : "s"}
					</p>
				</div>

				<AssessmentQuestionList
					items={assessment.assessmentQuestions}
					editable={editable}
					removing={removeMutation.isPending}
					onRemove={handleRemove}
				/>
			</div>

			<QuestionPickerDialog
				open={pickerOpen}
				onOpenChange={setPickerOpen}
				attachedQuestionIds={assessment.assessmentQuestions.map((item) => item.questionId)}
				onAttach={handleAttach}
			/>
		</div>
	);
}
