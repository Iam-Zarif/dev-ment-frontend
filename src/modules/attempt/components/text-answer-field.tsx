"use client";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnswerSavedState } from "@/modules/attempt/components/answer-saved-state";
import type { AttemptAnswerFieldProps, AttemptTextQuestion } from "@/types/attempt.types";

export function TextAnswerField({
	question,
	answer,
	saving,
	onSave,
}: AttemptAnswerFieldProps<AttemptTextQuestion>) {
	const initialValue = answer?.answerText ?? "";

	const [value, setValue] = useState(initialValue);

	const lastSavedValue = useRef(initialValue);

	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
			}
		};
	}, []);

	const persist = async (nextValue: string) => {
		if (nextValue === lastSavedValue.current) {
			return;
		}

		const previous = lastSavedValue.current;

		lastSavedValue.current = nextValue;

		try {
			await onSave({
				answerText: nextValue,
			});
		} catch (error) {
			lastSavedValue.current = previous;

			throw error;
		}
	};

	const scheduleSave = (nextValue: string) => {
		if (timerRef.current !== null) {
			window.clearTimeout(timerRef.current);
		}

		timerRef.current = window.setTimeout(() => {
			timerRef.current = null;

			void persist(nextValue).catch(() => undefined);
		}, 700);
	};

	const flushSave = () => {
		if (timerRef.current !== null) {
			window.clearTimeout(timerRef.current);

			timerRef.current = null;
		}

		void persist(value).catch(() => undefined);
	};

	return (
		<div className="space-y-2">
			<Label htmlFor="text-answer">Your answer</Label>

			<Textarea
				id="text-answer"
				value={value}
				rows={question.type === "LONG_TEXT" ? 10 : 5}
				maxLength={50_000}
				placeholder="Type your answer..."
				onChange={(event) => {
					const nextValue = event.target.value;

					setValue(nextValue);
					scheduleSave(nextValue);
				}}
				onBlur={flushSave}
			/>

			<AnswerSavedState saving={saving} answer={answer} />
		</div>
	);
}
