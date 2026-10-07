"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnswerSavedState } from "@/modules/attempt/components/answer-saved-state";
import { htmlToPlainText } from "@/modules/attempt/utils/html-to-plain-text";
import type { AttemptAnswerFieldProps, AttemptMcqQuestion } from "@/types/attempt.types";

export function McqAnswerField({
	question,
	answer,
	saving,
	onSave,
}: AttemptAnswerFieldProps<AttemptMcqQuestion>) {
	const [selected, setSelected] = useState<string[]>(answer?.selectedOptionIds ?? []);

	const saveSelected = async (nextSelected: string[]) => {
		const previous = selected;

		setSelected(nextSelected);

		try {
			await onSave({
				selectedOptionIds: nextSelected,
			});
		} catch {
			setSelected(previous);
		}
	};

	if (question.selectionMode === "MULTIPLE") {
		return (
			<div className="space-y-4">
				<div className="space-y-3">
					{question.options.map((option) => {
						const checked = selected.includes(option.id);

						const controlId = `attempt-${question.assessmentQuestionId}-${option.id}`;

						return (
							<div key={option.id} className="flex items-start gap-3 rounded-lg border p-4">
								<Checkbox
									id={controlId}
									checked={checked}
									disabled={saving}
									onCheckedChange={(value) => {
										const nextChecked = value === true;

										const next = nextChecked
											? Array.from(new Set([...selected, option.id]))
											: selected.filter((id) => id !== option.id);

										void saveSelected(next);
									}}
								/>

								<Label
									htmlFor={controlId}
									className="flex-1 cursor-pointer whitespace-pre-wrap text-sm font-normal leading-6"
								>
									{htmlToPlainText(option.optionHtml)}
								</Label>
							</div>
						);
					})}
				</div>

				<AnswerSavedState saving={saving} answer={answer} />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<RadioGroup
				value={selected[0] ?? ""}
				disabled={saving}
				onValueChange={(value) => void saveSelected([value])}
			>
				{question.options.map((option) => {
					const controlId = `attempt-${question.assessmentQuestionId}-${option.id}`;

					return (
						<div key={option.id} className="flex items-start gap-3 rounded-lg border p-4">
							<RadioGroupItem id={controlId} value={option.id} />

							<Label
								htmlFor={controlId}
								className="flex-1 cursor-pointer whitespace-pre-wrap text-sm font-normal leading-6"
							>
								{htmlToPlainText(option.optionHtml)}
							</Label>
						</div>
					);
				})}
			</RadioGroup>

			<AnswerSavedState saving={saving} answer={answer} />
		</div>
	);
}
