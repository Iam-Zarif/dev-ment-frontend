"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { EmptyState } from "@/components/feedback/empty-state";
import { AssessmentQuestionItem } from "@/modules/assessment/components/assessment-question-item";
import type { AssessmentQuestionItem as AssessmentQuestion } from "@/types/assessment.types";

type Props = {
	items: AssessmentQuestion[];

	editable: boolean;
	removing: boolean;
	reordering: boolean;

	updatingQuestionId?: string;

	onUpdateMarks: (assessmentQuestionId: string, marks: number) => Promise<void>;

	onReorder: (assessmentQuestionIds: string[]) => Promise<void>;

	onRemove: (assessmentQuestionId: string) => Promise<void>;
};

export function AssessmentQuestionList({
	items,
	editable,
	removing,
	reordering,
	updatingQuestionId,
	onUpdateMarks,
	onReorder,
	onRemove,
}: Props) {
	const [selectedQuestion, setSelectedQuestion] = useState<AssessmentQuestion | null>(null);

	if (items.length === 0) {
		return (
			<EmptyState
				title="No questions added"
				description={editable ? "Add questions from your question bank." : undefined}
			/>
		);
	}

	const moveQuestion = (index: number, offset: -1 | 1) => {
		const target = index + offset;

		if (target < 0 || target >= items.length) {
			return;
		}

		const next = [...items];

		[next[index], next[target]] = [next[target], next[index]];

		void onReorder(next.map((item) => item.id));
	};

	return (
		<>
			<div className="space-y-3">
				{items.map((item, index) => (
					<AssessmentQuestionItem
						key={item.id}
						item={item}
						position={index}
						total={items.length}
						editable={editable}
						savingMarks={updatingQuestionId === item.id}
						reordering={reordering}
						onSaveMarks={onUpdateMarks}
						onMoveUp={() => moveQuestion(index, -1)}
						onMoveDown={() => moveQuestion(index, 1)}
						onRemove={() => setSelectedQuestion(item)}
					/>
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
