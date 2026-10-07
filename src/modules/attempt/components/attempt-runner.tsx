"use client";

import { Clock3, Send } from "lucide-react";
import { useCallback, useState } from "react";

import { PageHeader } from "@/components/data-display/page-header";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { ErrorState } from "@/components/feedback/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AttemptAnswerFields } from "@/modules/attempt/components/attempt-answer-fields";
import { AttemptIntegrityControls } from "@/modules/attempt/components/attempt-integrity-controls";
import { formatAttemptTime, useAttemptTimer } from "@/modules/attempt/hooks/use-attempt-timer";
import { findAnswer, hasAnswer } from "@/modules/attempt/utils/attempt-answers";
import type { AttemptAnswerInput, AttemptSession, ProctorEventInput } from "@/types/attempt.types";
import { htmlToPlainText } from "@/utils/html-to-plain-text";

type RunnerProps = {
	session: AttemptSession;

	saveAnswer: (assessmentQuestionId: string, input: AttemptAnswerInput) => Promise<void>;

	savingQuestionId?: string;

	submitting: boolean;

	onSubmit: () => Promise<void>;
	recordProctorEvent: (input: ProctorEventInput) => Promise<unknown>;
};

export function AttemptRunner({
	session,
	saveAnswer,
	savingQuestionId,
	submitting,
	onSubmit,
	recordProctorEvent,
}: RunnerProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const [submitOpen, setSubmitOpen] = useState(false);

	const questions = session.questions;

	const currentQuestion = questions[currentIndex];

	const handleExpire = useCallback(() => {
		if (!submitting) {
			void onSubmit();
		}
	}, [onSubmit, submitting]);

	const remainingSeconds = useAttemptTimer(
		session.attempt.remainingSeconds,

		session.attempt.status === "IN_PROGRESS",

		handleExpire,
	);

	if (!currentQuestion) {
		return <ErrorState description="This assessment has no questions." />;
	}

	const currentAnswer = findAnswer(session.answers, currentQuestion.assessmentQuestionId);

	const answeredCount = questions.filter((question) =>
		hasAnswer(question, findAnswer(session.answers, question.assessmentQuestionId)),
	).length;

	const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

	return (
		<div className="space-y-6">
			<PageHeader
				title={session.assessment.title}
				description={session.assessment.company.name}
				action={
					<div className="flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm font-medium">
						<Clock3 className="size-4" />

						{formatAttemptTime(remainingSeconds)}
					</div>
				}
			/>

			<AttemptIntegrityControls
				active={session.attempt.status === "IN_PROGRESS" && !submitting}
				onRecord={recordProctorEvent}
			/>
			<div className="grid gap-6 lg:grid-cols-[1fr_220px]">
				<div className="space-y-4">
					<Card>
						<CardContent className="space-y-5">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<p className="text-sm text-muted-foreground">
										Question {currentIndex + 1} of {questions.length}
									</p>

									<div className="mt-2 flex gap-2">
										<Badge variant="outline">{currentQuestion.type}</Badge>

										<Badge variant="secondary">{currentQuestion.marks} marks</Badge>
									</div>
								</div>
							</div>

							<Progress value={progress} />

							<div className="whitespace-pre-wrap text-sm leading-7">
								{htmlToPlainText(currentQuestion.contentHtml)}
							</div>

							<AttemptAnswerFields
								key={currentQuestion.assessmentQuestionId}
								question={currentQuestion}
								answer={currentAnswer}
								saving={savingQuestionId === currentQuestion.assessmentQuestionId}
								onSave={(input) => saveAnswer(currentQuestion.assessmentQuestionId, input)}
							/>
						</CardContent>
					</Card>

					<div className="flex items-center justify-between gap-3">
						<Button
							type="button"
							variant="outline"
							disabled={currentIndex === 0}
							onClick={() => setCurrentIndex((index) => index - 1)}
						>
							Previous
						</Button>

						{currentIndex < questions.length - 1 ? (
							<Button type="button" onClick={() => setCurrentIndex((index) => index + 1)}>
								Next
							</Button>
						) : (
							<Button type="button" disabled={submitting} onClick={() => setSubmitOpen(true)}>
								<Send className="size-4" />
								Submit
							</Button>
						)}
					</div>
				</div>

				<Card className="h-fit">
					<CardContent className="space-y-4">
						<div>
							<p className="font-medium">Progress</p>

							<p className="mt-1 text-sm text-muted-foreground">
								{answeredCount}/{questions.length} answered
							</p>
						</div>

						<div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
							{questions.map((question, index) => {
								const answered = hasAnswer(
									question,
									findAnswer(session.answers, question.assessmentQuestionId),
								);

								return (
									<Button
										key={question.assessmentQuestionId}
										type="button"
										size="icon"
										variant={
											index === currentIndex ? "default" : answered ? "secondary" : "outline"
										}
										aria-label={`Go to question ${index + 1}`}
										onClick={() => setCurrentIndex(index)}
									>
										{index + 1}
									</Button>
								);
							})}
						</div>

						<Button
							type="button"
							variant="outline"
							className="w-full"
							disabled={submitting}
							onClick={() => setSubmitOpen(true)}
						>
							Submit assessment
						</Button>
					</CardContent>
				</Card>
			</div>

			<ConfirmDialog
				open={submitOpen}
				onOpenChange={setSubmitOpen}
				title="Submit assessment?"
				description={`${answeredCount} of ${questions.length} questions are currently answered. After submission, answers can no longer be changed.`}
				confirmLabel="Submit"
				loading={submitting}
				onConfirm={onSubmit}
			/>
		</div>
	);
}
