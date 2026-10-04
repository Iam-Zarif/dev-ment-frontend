"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/data-display/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { CodingQuestionFields } from "@/modules/question/components/coding-question-fields";
import { McqQuestionFields } from "@/modules/question/components/mcq-question-fields";
import { QuestionCommonFields } from "@/modules/question/components/question-common-fields";
import {
	parseQuestionLanguages,
	type QuestionFormValues,
	questionFormSchema,
} from "@/modules/question/schemas/question.schema";
import { questionService } from "@/modules/question/services/question.service";
import type { CreateQuestionInput } from "@/types/question.types";
import { formatError } from "@/utils/format-error";

function buildPayload(values: QuestionFormValues): CreateQuestionInput {
	const base = {
		contentHtml: values.contentHtml.trim(),

		difficulty: values.difficulty,

		defaultMarks: values.defaultMarks,

		evaluationRubric: values.evaluationRubric.trim() || null,
	};

	if (values.type === "MCQ") {
		return {
			...base,
			type: "MCQ",

			selectionMode: values.selectionMode,

			options: values.options.map((option, index) => ({
				optionHtml: option.optionHtml.trim(),

				isCorrect: option.isCorrect,

				sortOrder: index + 1,
			})),
		};
	}

	if (values.type === "CODING") {
		return {
			...base,
			type: "CODING",

			allowedLanguages: parseQuestionLanguages(values.allowedLanguages),

			starterCode: null,

			timeLimitMs: values.timeLimitMs,

			memoryLimitKb: values.memoryLimitKb,

			testCases: values.testCases.map((testCase, index) => ({
				inputText: testCase.inputText || null,

				expectedOutput: testCase.expectedOutput,

				isHidden: testCase.isHidden,

				weight: testCase.weight,

				sortOrder: index + 1,
			})),
		};
	}

	return {
		...base,
		type: values.type,
	};
}

export function QuestionCreateView() {
	const router = useRouter();

	const queryClient = useQueryClient();

	const {
		control,
		register,
		setValue,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<QuestionFormValues>({
		resolver: zodResolver(questionFormSchema),

		defaultValues: {
			type: "MCQ",
			contentHtml: "",
			difficulty: "INTERMEDIATE",
			defaultMarks: 10,
			evaluationRubric: "",

			selectionMode: "SINGLE",

			options: [
				{
					optionHtml: "",
					isCorrect: true,
				},
				{
					optionHtml: "",
					isCorrect: false,
				},
			],

			allowedLanguages: "javascript",

			timeLimitMs: 2000,
			memoryLimitKb: 131072,

			testCases: [
				{
					inputText: "",
					expectedOutput: "",
					isHidden: true,
					weight: 1,
				},
			],
		},
	});

	const type = useWatch({
		control,
		name: "type",
	});

	const onSubmit = async (values: QuestionFormValues) => {
		try {
			await questionService.create(buildPayload(values));

			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.QUESTIONS,
			});

			toast.success("Question created");

			router.replace(ROUTES.RECRUITER_QUESTIONS);

			router.refresh();
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			<PageHeader title="Create question" />

			<Card>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
						<QuestionCommonFields
							control={control}
							register={register}
							errors={errors}
							disabled={isSubmitting}
						/>

						{type === "MCQ" && (
							<McqQuestionFields
								control={control}
								register={register}
								setValue={setValue}
								errors={errors}
								disabled={isSubmitting}
							/>
						)}

						{type === "CODING" && (
							<CodingQuestionFields
								control={control}
								register={register}
								errors={errors}
								disabled={isSubmitting}
							/>
						)}

						<div className="flex items-center justify-between border-t pt-5">
							<Button asChild type="button" variant="ghost">
								<Link href={ROUTES.RECRUITER_QUESTIONS}>Cancel</Link>
							</Button>

							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="size-4 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="size-4" />
										Create question
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
