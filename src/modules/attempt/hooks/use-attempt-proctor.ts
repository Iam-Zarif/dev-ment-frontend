"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ProctorEventInput, ProctorEventType } from "@/types/attempt.types";

type Props = {
	active: boolean;

	onRecord: (input: ProctorEventInput) => Promise<unknown>;
};

export function useAttemptProctor({ active, onRecord }: Props) {
	const [fullscreenActive, setFullscreenActive] = useState(false);

	const onRecordRef = useRef(onRecord);

	const queueRef = useRef<Promise<void>>(Promise.resolve());

	const blurTimerRef = useRef<number | null>(null);

	const enteredFullscreenRef = useRef(false);

	useEffect(() => {
		onRecordRef.current = onRecord;
	}, [onRecord]);

	const record = useCallback((eventType: ProctorEventType) => {
		const input: ProctorEventInput = {
			clientEventId: crypto.randomUUID(),
			eventType,
			occurredAt: new Date().toISOString(),
		};

		queueRef.current = queueRef.current
			.then(async () => {
				await onRecordRef.current(input);
			})
			.catch(() => undefined);
	}, []);

	useEffect(() => {
		if (!active) {
			return;
		}

		enteredFullscreenRef.current = Boolean(document.fullscreenElement);

		const handleVisibility = () => {
			if (document.visibilityState !== "hidden") {
				return;
			}

			if (blurTimerRef.current !== null) {
				window.clearTimeout(blurTimerRef.current);

				blurTimerRef.current = null;
			}

			record("TAB_HIDDEN");
		};

		const handleBlur = () => {
			if (blurTimerRef.current !== null) {
				window.clearTimeout(blurTimerRef.current);
			}

			blurTimerRef.current = window.setTimeout(() => {
				blurTimerRef.current = null;

				if (document.visibilityState === "visible") {
					record("WINDOW_BLUR");
				}
			}, 150);
		};

		const handleFullscreen = () => {
			const isFullscreen = Boolean(document.fullscreenElement);

			setFullscreenActive(isFullscreen);

			if (isFullscreen) {
				enteredFullscreenRef.current = true;

				return;
			}

			if (enteredFullscreenRef.current) {
				enteredFullscreenRef.current = false;

				record("FULLSCREEN_EXIT");
			}
		};

		document.addEventListener("visibilitychange", handleVisibility);

		window.addEventListener("blur", handleBlur);

		document.addEventListener("fullscreenchange", handleFullscreen);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibility);

			window.removeEventListener("blur", handleBlur);

			document.removeEventListener("fullscreenchange", handleFullscreen);

			if (blurTimerRef.current !== null) {
				window.clearTimeout(blurTimerRef.current);
			}
		};
	}, [active, record]);

	const enterFullscreen = useCallback(async () => {
		if (document.fullscreenElement) {
			return true;
		}

		try {
			await document.documentElement.requestFullscreen();

			return true;
		} catch {
			return false;
		}
	}, []);

	return {
		fullscreenActive,
		enterFullscreen,
	};
}
