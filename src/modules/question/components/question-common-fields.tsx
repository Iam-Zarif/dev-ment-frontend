"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionFormValues } from "@/modules/question/schemas/question.schema";
import { DIFFICULTY_LEVELS } from "@/types/assessment.types";
import { QUESTION_TYPES } from "@/types/question.types";

type Props = {
	control: Control<QuestionFormValues>;
	register: UseFormRegister<QuestionFormValues>;
	errors: FieldErrors<QuestionFormValues>;
	disabled?: boolean;
};

function label(value: string) {
	return value
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/^\w/, (char) => char.toUpperCase());
}

export function QuestionCommonFields({ control, register, errors, disabled }: Props) {
	return (
		<div className="space-y-5">
			<div className="space-y-2">
				<Label>Question type</Label>

				<Controller
					control={control}
					name="type"
					render={({ field }) => (
						<Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								{QUESTION_TYPES.map((type) => (
									<SelectItem key={type} value={type}>
										{label(type)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="question-content">Question content</Label>

				<Textarea
					id="question-content"
					rows={6}
					placeholder="Write the question..."
					disabled={disabled}
					aria-invalid={Boolean(errors.contentHtml)}
					{...register("contentHtml")}
				/>

				{errors.contentHtml && (
					<p className="text-sm text-destructive">{errors.contentHtml.message}</p>
				)}
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<div className="space-y-2">
					<Label>Difficulty</Label>

					<Controller
						control={control}
						name="difficulty"
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									{DIFFICULTY_LEVELS.map((difficulty) => (
										<SelectItem key={difficulty} value={difficulty}>
											{label(difficulty)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="default-marks">Default marks</Label>

					<Input
						id="default-marks"
						type="number"
						min={0.01}
						disabled={disabled}
						aria-invalid={Boolean(errors.defaultMarks)}
						{...register("defaultMarks", {
							valueAsNumber: true,
						})}
					/>

					{errors.defaultMarks && (
						<p className="text-sm text-destructive">{errors.defaultMarks.message}</p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="evaluation-rubric">Evaluation rubric</Label>

				<Textarea
					id="evaluation-rubric"
					rows={3}
					placeholder="Optional evaluation guidance"
					disabled={disabled}
					{...register("evaluationRubric")}
				/>
			</div>
		</div>
	);
}
