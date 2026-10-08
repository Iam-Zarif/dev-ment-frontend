"use client";

import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/data-display/page-header";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/constants";
import { evaluationService } from "@/modules/evaluation/services/evaluation.service";
import { formatError } from "@/utils/format-error";
import { htmlToPlainText } from "@/utils/html-to-plain-text";

export function CandidateResultView({ attemptId }: { attemptId: string }) {
	const query = useQuery({
		queryKey: [...QUERY_KEYS.EVALUATIONS, "result", attemptId],

		queryFn: () => evaluationService.getCandidateResult(attemptId),

		retry: false,
	});

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return (
			<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
		);
	}

	const result = query.data;

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<PageHeader
				title={result.assessment.title}
				description={result.assessment.company.name}
				action={
					<Badge variant={result.passed ? "default" : "destructive"}>
						{result.passed ? "Passed" : "Not passed"}
					</Badge>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardContent>
						<p className="text-sm text-muted-foreground">Score</p>

						<p className="mt-1 text-2xl font-semibold">
							{result.totalScore}/{result.totalMarks}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						<p className="text-sm text-muted-foreground">Percentage</p>

						<p className="mt-1 text-2xl font-semibold">{result.percentage}%</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent>
						<p className="text-sm text-muted-foreground">Pass mark</p>

						<p className="mt-1 text-2xl font-semibold">{result.assessment.passPercentage}%</p>
					</CardContent>
				</Card>
			</div>

			{result.finalFeedback && (
				<Card>
					<CardContent>
						<h2 className="font-semibold">Final feedback</h2>

						<p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
							{result.finalFeedback}
						</p>
					</CardContent>
				</Card>
			)}

			<div className="space-y-3">
				{result.questions.map((question) => (
					<Card key={question.assessmentQuestionId}>
						<CardContent className="space-y-3">
							<div className="flex justify-between gap-3">
								<p className="font-medium">Question {question.sortOrder + 1}</p>

								<Badge variant="outline">
									{question.score}/{question.marks}
								</Badge>
							</div>

							<p className="whitespace-pre-wrap text-sm">{htmlToPlainText(question.contentHtml)}</p>

							{question.feedback && (
								<p className="text-sm text-muted-foreground">Feedback: {question.feedback}</p>
							)}
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
