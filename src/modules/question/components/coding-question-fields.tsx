"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionFormValues } from "@/modules/question/schemas/question.schema";

type Props = {
	control: Control<QuestionFormValues>;
	register: UseFormRegister<QuestionFormValues>;
	errors: FieldErrors<QuestionFormValues>;
	disabled?: boolean;
};

export function CodingQuestionFields({ control, register, errors, disabled }: Props) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: "testCases",
	});

	return (
		<div className="space-y-5 border-t pt-5">
			<div className="space-y-2">
				<Label htmlFor="languages">Allowed languages</Label>

				<Input
					id="languages"
					placeholder="javascript, typescript, python"
					disabled={disabled}
					aria-invalid={Boolean(errors.allowedLanguages)}
					{...register("allowedLanguages")}
				/>

				{errors.allowedLanguages && (
					<p className="text-sm text-destructive">{errors.allowedLanguages.message}</p>
				)}
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="time-limit">Time limit (ms)</Label>

					<Input
						id="time-limit"
						type="number"
						min={100}
						max={60000}
						disabled={disabled}
						{...register("timeLimitMs", {
							valueAsNumber: true,
						})}
					/>

					{errors.timeLimitMs && (
						<p className="text-sm text-destructive">{errors.timeLimitMs.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="memory-limit">Memory limit (KB)</Label>

					<Input
						id="memory-limit"
						type="number"
						min={1024}
						max={1048576}
						disabled={disabled}
						{...register("memoryLimitKb", {
							valueAsNumber: true,
						})}
					/>

					{errors.memoryLimitKb && (
						<p className="text-sm text-destructive">{errors.memoryLimitKb.message}</p>
					)}
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<Label>Test cases</Label>

					<Button
						type="button"
						size="sm"
						variant="outline"
						disabled={disabled || fields.length >= 50}
						onClick={() =>
							append({
								inputText: "",
								expectedOutput: "",
								isHidden: true,
								weight: 1,
							})
						}
					>
						<Plus className="size-4" />
						Add case
					</Button>
				</div>

				{fields.map((field, index) => (
					<div key={field.id} className="space-y-3 rounded-lg border p-4">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium">Test case {index + 1}</p>

							<Button
								type="button"
								variant="ghost"
								size="icon"
								disabled={disabled || fields.length <= 1}
								onClick={() => remove(index)}
								aria-label="Remove test case"
							>
								<Trash2 className="size-4" />
							</Button>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<Textarea
								placeholder="Input"
								disabled={disabled}
								{...register(`testCases.${index}.inputText`)}
							/>

							<Textarea
								placeholder="Expected output"
								disabled={disabled}
								{...register(`testCases.${index}.expectedOutput`)}
							/>
						</div>

						<div className="flex items-center justify-between gap-4">
							<div className="space-y-1">
								<Label>Hidden</Label>

								<Controller
									control={control}
									name={`testCases.${index}.isHidden`}
									render={({ field: hiddenField }) => (
										<Switch
											checked={Boolean(hiddenField.value)}
											onCheckedChange={hiddenField.onChange}
											disabled={disabled}
										/>
									)}
								/>
							</div>

							<div className="w-28 space-y-1">
								<Label>Weight</Label>

								<Input
									type="number"
									min={0.01}
									disabled={disabled}
									{...register(`testCases.${index}.weight`, {
										valueAsNumber: true,
									})}
								/>
							</div>
						</div>
					</div>
				))}

				{errors.testCases?.message && (
					<p className="text-sm text-destructive">{errors.testCases.message}</p>
				)}
			</div>
		</div>
	);
}
