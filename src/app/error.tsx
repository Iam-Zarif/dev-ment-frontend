"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/feedback/error-state";

type ErrorPageProps = {
	error: Error & {
		digest?: string;
	};
	reset: () => void;
};

export default function ErrorPage({
	error,
	reset,
}: ErrorPageProps) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<ErrorState
			title="Unable to load this page"
			description="An unexpected error occurred while loading this page."
			onRetry={reset}
		/>
	);
}