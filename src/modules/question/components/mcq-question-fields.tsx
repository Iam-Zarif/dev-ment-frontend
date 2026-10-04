"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Controller, useFieldArray, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { QuestionFormValues } from "@/modules/question/schemas/question.schema";

type Props = {
	control: Control<QuestionFormValues>;
	register: UseFormRegister<QuestionFormValues>;
	setValue: UseFormSetValue<QuestionFormValues>;
	errors: FieldErrors<QuestionFormValues>;
	disabled?: boolean;
};

export function McqQuestionFields({ control, register, setValue, errors, disabled }: Props) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: "options",
	});

	const selectionMode = useWatch({
		control,
		name: "selectionMode",
	});

	return (
		<div className="space-y-5 border-t pt-5">
			<div className="space-y-2">
				<Label>Selection mode</Label>

				<Controller
					control={control}
					name="selectionMode"
					render={({ field }) => (
						<Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="SINGLE">Single choice</SelectItem>

								<SelectItem value="MULTIPLE">Multiple choice</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<Label>Options</Label>

					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={disabled || fields.length >= 20}
						onClick={() =>
							append({
								optionHtml: "",
								isCorrect: false,
							})
						}
					>
						<Plus className="size-4" />
						Add option
					</Button>
				</div>

				{fields.map((field, index) => (
					<div key={field.id} className="flex items-start gap-3 rounded-lg border p-3">
						<Controller
							control={control}
							name={`options.${index}.isCorrect`}
							render={({ field: correctField }) => (
								<Checkbox
									className="mt-2"
									checked={Boolean(correctField.value)}
									disabled={disabled}
									onCheckedChange={(checked) => {
										const next = checked === true;

										if (selectionMode === "SINGLE" && next) {
											fields.forEach((_, optionIndex) => {
												setValue(`options.${optionIndex}.isCorrect`, optionIndex === index);
											});

											return;
										}

										correctField.onChange(next);
									}}
									aria-label={`Mark option ${index + 1} correct`}
								/>
							)}
						/>

						<div className="min-w-0 flex-1">
							<Input
								placeholder={`Option ${index + 1}`}
								disabled={disabled}
								aria-invalid={Boolean(errors.options?.[index]?.optionHtml)}
								{...register(`options.${index}.optionHtml`)}
							/>

							{errors.options?.[index]?.optionHtml && (
								<p className="mt-1 text-sm text-destructive">
									{errors.options[index]?.optionHtml?.message}
								</p>
							)}
						</div>

						<Button
							type="button"
							variant="ghost"
							size="icon"
							disabled={disabled || fields.length <= 2}
							onClick={() => remove(index)}
							aria-label="Remove option"
						>
							<Trash2 className="size-4" />
						</Button>
					</div>
				))}

				{errors.options?.message && (
					<p className="text-sm text-destructive">{errors.options.message}</p>
				)}
			</div>
		</div>
	);
}
