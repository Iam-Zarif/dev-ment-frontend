"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { AttemptRunner } from "@/modules/attempt/components/attempt-runner";
import { useAttemptSession } from "@/modules/attempt/hooks/use-attempt-session";
import type { AttemptAnswerInput } from "@/types/attempt.types";
import { formatError } from "@/utils/format-error";
export function CandidateAttemptView({ attemptId }: { attemptId: string }) {
	const { query, saveAnswerMutation, submitMutation, proctorEventMutation } =
		useAttemptSession(attemptId);

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return (
			<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
		);
	}

	const session = query.data;

	if (session.attempt.status !== "IN_PROGRESS") {
		return (
			<div className="mx-auto max-w-2xl py-10">
				<Card>
					<CardContent className="flex flex-col items-center gap-4 py-10 text-center">
						<CheckCircle2 className="size-10 text-primary" />

						<div>
							<h1 className="font-heading text-xl font-semibold">Assessment submitted</h1>

							<p className="mt-2 text-sm text-muted-foreground">
								Your answers have been submitted successfully.
							</p>
						</div>

						<div className="flex flex-wrap justify-center gap-2">
							<Button asChild>
								<Link href={ROUTES.CANDIDATE_RESULT(attemptId)}>Check result</Link>
							</Button>

							<Button asChild variant="outline">
								<Link href={ROUTES.CANDIDATE_APPLICATIONS}>My applications</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const saveAnswer = async (assessmentQuestionId: string, input: AttemptAnswerInput) => {
		try {
			await saveAnswerMutation.mutateAsync({
				assessmentQuestionId,
				input,
			});
		} catch (error) {
			toast.error(formatError(error));

			throw error;
		}
	};

	const submit = async () => {
		try {
			const result = await submitMutation.mutateAsync();

			toast.success(
				result.status === "AUTO_SUBMITTED"
					? "Time ended. Assessment submitted automatically."
					: "Assessment submitted",
			);
		} catch (error) {
			toast.error(formatError(error));

			throw error;
		}
	};

	return (
		<AttemptRunner
			session={session}
			savingQuestionId={
				saveAnswerMutation.isPending
					? saveAnswerMutation.variables?.assessmentQuestionId
					: undefined
			}
			submitting={submitMutation.isPending}
			saveAnswer={saveAnswer}
			onSubmit={submit}
			recordProctorEvent={(input) => proctorEventMutation.mutateAsync(input)}
		/>
	);
}
