"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { EmptyState } from "@/components/feedback/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AssessmentQuestionItem } from "@/types/assessment.types";

type Props = {
	items: AssessmentQuestionItem[];
	editable: boolean;

	removing: boolean;

	onRemove: (assessmentQuestionId: string) => Promise<void>;
};

function preview(html: string) {
	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function AssessmentQuestionList({ items, editable, removing, onRemove }: Props) {
	const [selectedQuestion, setSelectedQuestion] = useState<AssessmentQuestionItem | null>(null);

	if (items.length === 0) {
		return (
			<EmptyState
				title="No questions added"
				description={editable ? "Add questions from your question bank." : undefined}
			/>
		);
	}

	return (
		<>
			<div className="space-y-3">
				{items.map((item, index) => (
					<div key={item.id} className="flex items-start gap-4 rounded-xl border bg-card p-4">
						<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
							{index + 1}
						</div>

						<div className="min-w-0 flex-1">
							<p className="font-medium">
								{preview(item.question.contentHtml) || "Untitled question"}
							</p>

							<div className="mt-2 flex flex-wrap items-center gap-2">
								<Badge variant="secondary">{item.question.type}</Badge>

								<Badge variant="outline">{item.question.difficulty}</Badge>

								<span className="text-xs text-muted-foreground">{item.marks} marks</span>
							</div>
						</div>

						{editable && (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label="Remove question"
								onClick={() => setSelectedQuestion(item)}
							>
								<Trash2 className="size-4" />
							</Button>
						)}
					</div>
				))}
			</div>

			<ConfirmDialog
				open={Boolean(selectedQuestion)}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedQuestion(null);
					}
				}}
				title="Remove question?"
				description="This question will be removed from the assessment, but it will remain in the question bank."
				confirmLabel="Remove"
				destructive
				loading={removing}
				onConfirm={async () => {
					if (!selectedQuestion) {
						return;
					}

					await onRemove(selectedQuestion.id);

					setSelectedQuestion(null);
				}}
			/>
		</>
	);
}
