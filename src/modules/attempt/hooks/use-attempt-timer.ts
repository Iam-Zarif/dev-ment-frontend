"use client";

import { useEffect, useRef, useState } from "react";

export function useAttemptTimer(initialSeconds: number, active: boolean, onExpire: () => void) {
	const safeInitialSeconds = Math.max(0, initialSeconds);

	const [deadline] = useState(() => Date.now() + safeInitialSeconds * 1000);

	const [remainingSeconds, setRemainingSeconds] = useState(safeInitialSeconds);

	const expiryHandled = useRef(false);

	useEffect(() => {
		if (!active) {
			return;
		}

		const interval = window.setInterval(() => {
			const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

			setRemainingSeconds(remaining);

			if (remaining === 0 && !expiryHandled.current) {
				expiryHandled.current = true;

				onExpire();
			}
		}, 1000);

		return () => {
			window.clearInterval(interval);
		};
	}, [active, deadline, onExpire]);

	return remainingSeconds;
}

export function formatAttemptTime(totalSeconds: number) {
	const safeSeconds = Math.max(0, totalSeconds);

	const hours = Math.floor(safeSeconds / 3600);

	const minutes = Math.floor((safeSeconds % 3600) / 60);

	const seconds = safeSeconds % 60;

	if (hours > 0) {
		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
			seconds,
		).padStart(2, "0")}`;
	}

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
