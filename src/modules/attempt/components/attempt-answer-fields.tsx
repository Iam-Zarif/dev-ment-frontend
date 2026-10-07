"use client";
import { CodingAnswerField } from "@/modules/attempt/components/coding-answer-field";
import { McqAnswerField } from "@/modules/attempt/components/mcq-answer-field";
import { TextAnswerField } from "@/modules/attempt/components/text-answer-field";
import type { AttemptAnswerFieldProps } from "@/types/attempt.types";
export function AttemptAnswerFields({ question, answer, saving, onSave }: AttemptAnswerFieldProps) {
	if (question.type === "MCQ") {
		return <McqAnswerField question={question} answer={answer} saving={saving} onSave={onSave} />;
	}

	if (question.type === "SHORT_TEXT" || question.type === "LONG_TEXT") {
		return <TextAnswerField question={question} answer={answer} saving={saving} onSave={onSave} />;
	}

	return <CodingAnswerField question={question} answer={answer} saving={saving} onSave={onSave} />;
}
