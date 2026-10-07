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

const AUTOSAVE_DELAY = 700;

function getStarterCode(starterCode: unknown, language: string) {
	if (typeof starterCode !== "object" || starterCode === null || Array.isArray(starterCode)) {
		return "";
	}

	const record = starterCode as Record<string, unknown>;

	const value = record[language];

	return typeof value === "string" ? value : "";
}

function createSnapshot(code: string, language: string) {
	return JSON.stringify({
		code,
		language,
	});
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

	const [dirty, setDirty] = useState(false);

	const latestRef = useRef({
		code: initialCode,
		language: initialLanguage,
	});

	const lastSavedSnapshot = useRef(createSnapshot(initialCode, initialLanguage));

	const timerRef = useRef<number | null>(null);

	const mountedRef = useRef(true);

	const onSaveRef = useRef(onSave);

	useEffect(() => {
		onSaveRef.current = onSave;
	}, [onSave]);

	const saveSnapshot = async (nextCode: string, nextLanguage: string) => {
		if (!nextLanguage) {
			return;
		}

		const snapshot = createSnapshot(nextCode, nextLanguage);

		if (snapshot === lastSavedSnapshot.current) {
			if (mountedRef.current) {
				setDirty(createSnapshot(latestRef.current.code, latestRef.current.language) !== snapshot);
			}

			return;
		}

		try {
			await onSaveRef.current({
				codeAnswer: nextCode,
				language: nextLanguage,
			});

			lastSavedSnapshot.current = snapshot;

			if (mountedRef.current) {
				const latest = latestRef.current;

				setDirty(createSnapshot(latest.code, latest.language) !== snapshot);
			}
		} catch (error) {
			if (mountedRef.current) {
				setDirty(true);
			}

			throw error;
		}
	};

	const queueRef = useRef<Promise<void>>(Promise.resolve());
	const persist = (nextCode: string, nextLanguage: string) => {
		const request = queueRef.current.then(() => saveSnapshot(nextCode, nextLanguage));
		queueRef.current = request.catch(() => undefined);
		return request;
	};
	const persistRef = useRef(persist);
	useEffect(() => {
		persistRef.current = persist;
	});
	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			if (timerRef.current !== null) window.clearTimeout(timerRef.current);
			const latest = latestRef.current;
			void persistRef.current(latest.code, latest.language).catch(() => undefined);
		};
	}, []);

	const scheduleSave = (nextCode: string, nextLanguage: string) => {
		if (timerRef.current !== null) {
			window.clearTimeout(timerRef.current);
		}

		timerRef.current = window.setTimeout(() => {
			timerRef.current = null;

			void persist(nextCode, nextLanguage).catch(() => undefined);
		}, AUTOSAVE_DELAY);
	};

	const flushSave = () => {
		if (timerRef.current !== null) {
			window.clearTimeout(timerRef.current);

			timerRef.current = null;
		}

		const latest = latestRef.current;

		void persist(latest.code, latest.language).catch(() => undefined);
	};

	const updateDirty = (nextCode: string, nextLanguage: string) => {
		setDirty(createSnapshot(nextCode, nextLanguage) !== lastSavedSnapshot.current);
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="code-language">Language</Label>

				<Select
					value={language}
					onValueChange={(value) => {
						setLanguage(value);

						latestRef.current = {
							code,
							language: value,
						};

						updateDirty(code, value);

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

						latestRef.current = {
							code: nextCode,
							language,
						};

						updateDirty(nextCode, language);

						scheduleSave(nextCode, language);
					}}
					onBlur={flushSave}
				/>
			</div>

			<AnswerSavedState saving={saving} dirty={dirty} answer={answer} />
		</div>
	);
}
