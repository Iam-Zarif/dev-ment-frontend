"use client";

import { Check, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { AssessmentQuestionItem as AssessmentQuestion } from "@/types/assessment.types";

type Props = {
	item: AssessmentQuestion;

	position: number;
	total: number;

	editable: boolean;
	savingMarks: boolean;
	reordering: boolean;

	onSaveMarks: (assessmentQuestionId: string, marks: number) => Promise<void>;

	onMoveUp: () => void;
	onMoveDown: () => void;
	onRemove: () => void;
};

function preview(html: string) {
	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function AssessmentQuestionItem({
	item,
	position,
	total,
	editable,
	savingMarks,
	reordering,
	onSaveMarks,
	onMoveUp,
	onMoveDown,
	onRemove,
}: Props) {
	const [draftMarks, setDraftMarks] = useState<string | null>(null);

	const marks = draftMarks ?? String(item.marks);

	const numericMarks = Number(marks);

	const marksValid = Number.isFinite(numericMarks) && numericMarks > 0 && numericMarks <= 10_000;

	const marksChanged = draftMarks !== null && marksValid && numericMarks !== Number(item.marks);

	const handleSaveMarks = async () => {
		if (!marksChanged) {
			return;
		}

		try {
			await onSaveMarks(item.id, numericMarks);

			setDraftMarks(null);
		} catch {
			setDraftMarks(null);
		}
	};

	return (
		<div className="flex items-start gap-3 rounded-xl border bg-card p-4">
			<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
				{position + 1}
			</div>

			<div className="min-w-0 flex-1">
				<p className="font-medium">{preview(item.question.contentHtml) || "Untitled question"}</p>

				<div className="mt-2 flex flex-wrap items-center gap-2">
					<Badge variant="secondary">{item.question.type}</Badge>

					<Badge variant="outline">{item.question.difficulty}</Badge>

					{editable ? (
						<div className="ml-auto flex items-center gap-1.5">
							<span className="text-xs text-muted-foreground">Marks</span>

							<Input
								type="number"
								min={0.01}
								max={10000}
								step="0.01"
								value={marks}
								className="w-20"
								disabled={savingMarks}
								aria-invalid={!marksValid}
								onChange={(event) => setDraftMarks(event.target.value)}
							/>

							{marksChanged && (
								<Button
									type="button"
									size="icon"
									variant="ghost"
									disabled={savingMarks}
									aria-label="Save marks"
									onClick={() => void handleSaveMarks()}
								>
									{savingMarks ? <Spinner className="size-4" /> : <Check className="size-4" />}
								</Button>
							)}
						</div>
					) : (
						<span className="text-xs text-muted-foreground">{item.marks} marks</span>
					)}
				</div>
			</div>

			{editable && (
				<div className="flex shrink-0 items-center gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						disabled={reordering || position === 0}
						aria-label="Move question up"
						onClick={onMoveUp}
					>
						<ChevronUp className="size-4" />
					</Button>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						disabled={reordering || position === total - 1}
						aria-label="Move question down"
						onClick={onMoveDown}
					>
						<ChevronDown className="size-4" />
					</Button>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Remove question"
						onClick={onRemove}
					>
						<Trash2 className="size-4" />
					</Button>
				</div>
			)}
		</div>
	);
}
