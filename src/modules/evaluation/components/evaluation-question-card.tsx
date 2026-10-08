"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EvaluationQuestion, ManualEvaluationInput } from "@/types/evaluation.types";
import { htmlToPlainText } from "@/utils/html-to-plain-text";

type Props = {
	item: EvaluationQuestion;
	locked: boolean;
	saving: boolean;

	onSave: (assessmentQuestionId: string, input: ManualEvaluationInput) => Promise<void>;
};

export function EvaluationQuestionCard({ item, locked, saving, onSave }: Props) {
	const maxMarks = Number(item.marks);

	const schema = z.object({
		manualScore: z.coerce.number().min(0).max(maxMarks, `Score cannot exceed ${maxMarks}`),

		recruiterFeedback: z.string().trim().max(5000, "Feedback is too long"),
	});

	type FormValues = z.infer<typeof schema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),

		defaultValues: {
			manualScore: Number(item.answer?.manualScore ?? item.answer?.finalScore ?? 0),

			recruiterFeedback: item.answer?.recruiterFeedback ?? "",
		},
	});

	const isMcq = item.question.type === "MCQ";

	const selectedIds = new Set(item.answer?.selectedOptions.map((option) => option.optionId) ?? []);

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-wrap items-start justify-between gap-3">
					<CardTitle className="text-base">Question {item.sortOrder + 1}</CardTitle>

					<div className="flex gap-2">
						<Badge variant="outline">{item.question.type}</Badge>

						<Badge variant="secondary">{maxMarks} marks</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-5">
				<p className="whitespace-pre-wrap text-sm leading-6">
					{htmlToPlainText(item.question.contentHtml)}
				</p>

				{isMcq && (
					<div className="space-y-2">
						{item.question.options.map((option) => (
							<div
								key={option.id}
								className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm"
							>
								<span>{htmlToPlainText(option.optionHtml)}</span>

								<div className="flex gap-1">
									{selectedIds.has(option.id) && <Badge>Selected</Badge>}

									{option.isCorrect && <Badge variant="secondary">Correct</Badge>}
								</div>
							</div>
						))}
					</div>
				)}

				{item.question.type === "SHORT_TEXT" || item.question.type === "LONG_TEXT" ? (
					<div className="rounded-lg bg-muted/40 p-4 text-sm whitespace-pre-wrap">
						{item.answer?.answerText || "No answer submitted."}
					</div>
				) : null}

				{item.question.type === "CODING" && (
					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">
							Language: {item.answer?.language ?? "—"}
						</p>

						<pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-xs">
							{item.answer?.codeAnswer || "No code submitted."}
						</pre>
					</div>
				)}

				{!isMcq && (
					<form
						onSubmit={handleSubmit(async (values) => {
							await onSave(item.id, {
								manualScore: values.manualScore,

								recruiterFeedback: values.recruiterFeedback || null,
							});
						})}
						className="grid gap-4 border-t pt-5 md:grid-cols-[160px_1fr]"
					>
						<div className="space-y-2">
							<Label htmlFor={`score-${item.id}`}>Score</Label>

							<Input
								id={`score-${item.id}`}
								type="number"
								min={0}
								max={maxMarks}
								step="0.01"
								disabled={locked}
								{...register("manualScore")}
							/>

							{errors.manualScore && (
								<p className="text-xs text-destructive">{errors.manualScore.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor={`feedback-${item.id}`}>Feedback</Label>

							<Textarea
								id={`feedback-${item.id}`}
								rows={3}
								maxLength={5000}
								disabled={locked}
								{...register("recruiterFeedback")}
							/>

							{!locked && (
								<Button type="submit" size="sm" disabled={saving || isSubmitting}>
									Save review
								</Button>
							)}
						</div>
					</form>
				)}
			</CardContent>
		</Card>
	);
}
