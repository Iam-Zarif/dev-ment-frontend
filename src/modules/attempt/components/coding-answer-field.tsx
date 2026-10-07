"use client";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AnswerSavedState } from "@/modules/attempt/components/answer-saved-state";
import type { AttemptAnswerFieldProps, AttemptCodingQuestion } from "@/types/attempt.types";

function getStarterCode(starterCode: unknown, language: string) {
	if (typeof starterCode !== "object" || starterCode === null || Array.isArray(starterCode)) {
		return "";
	}

	const record = starterCode as Record<string, unknown>;

	const value = record[language];

	return typeof value === "string" ? value : "";
}

export function CodingAnswerField({
	question,
	answer,
	saving,
	onSave,
}: AttemptAnswerFieldProps<AttemptCodingQuestion>) {
	const initialLanguage = answer?.language ?? question.allowedLanguages[0] ?? "";

	const initialCode = answer?.codeAnswer ?? getStarterCode(question.starterCode, initialLanguage);

	const [language, setLanguage] = useState(initialLanguage);

	const [code, setCode] = useState(initialCode);

	const initialSnapshot = JSON.stringify({
		language: initialLanguage,
		code: initialCode,
	});

	const lastSavedSnapshot = useRef(initialSnapshot);

	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
			}
		};
	}, []);

	const persist = async (nextCode: string, nextLanguage: string) => {
		if (!nextLanguage) {
			return;
		}

		const snapshot = JSON.stringify({
			language: nextLanguage,
			code: nextCode,
		});

		if (snapshot === lastSavedSnapshot.current) {
			return;
		}

		const previous = lastSavedSnapshot.current;

		lastSavedSnapshot.current = snapshot;

		try {
			await onSave({
				codeAnswer: nextCode,

				language: nextLanguage,
			});
		} catch (error) {
			lastSavedSnapshot.current = previous;

			throw error;
		}
	};

	const scheduleSave = (nextCode: string, nextLanguage: string) => {
		if (timerRef.current !== null) {
			window.clearTimeout(timerRef.current);
		}

		timerRef.current = window.setTimeout(() => {
			timerRef.current = null;

			void persist(nextCode, nextLanguage).catch(() => undefined);
		}, 700);
	};

	const flushSave = () => {
		if (timerRef.current !== null) {
			window.clearTimeout(timerRef.current);

			timerRef.current = null;
		}

		void persist(code, language).catch(() => undefined);
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="code-language">Language</Label>

				<Select
					value={language}
					onValueChange={(value) => {
						setLanguage(value);

						scheduleSave(code, value);
					}}
				>
					<SelectTrigger id="code-language" className="w-full sm:w-56">
						<SelectValue placeholder="Select language" />
					</SelectTrigger>

					<SelectContent>
						{question.allowedLanguages.map((item) => (
							<SelectItem key={item} value={item}>
								{item}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label htmlFor="code-answer">Code</Label>

				<Textarea
					id="code-answer"
					value={code}
					rows={16}
					maxLength={200_000}
					className="font-mono"
					placeholder="Write your solution..."
					onChange={(event) => {
						const nextCode = event.target.value;

						setCode(nextCode);

						scheduleSave(nextCode, language);
					}}
					onBlur={flushSave}
				/>
			</div>

			<AnswerSavedState saving={saving} answer={answer} />
		</div>
	);
}
