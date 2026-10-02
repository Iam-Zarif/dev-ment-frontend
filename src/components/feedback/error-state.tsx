"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

type ErrorStateProps = {
	title?: string;
	description?: string;
	onRetry?: () => void;
};

export function ErrorState({
	title = "Something went wrong",
	description = "We couldn't load this content. Please try again.",
	onRetry,
}: ErrorStateProps) {
	return (
		<div className="flex min-h-80 items-center justify-center p-6">
			<div className="max-w-md text-center">
				<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-danger dark:bg-red-950/30">
					<AlertTriangle className="size-6" />
				</div>

				<h2 className="text-xl font-semibold">{title}</h2>

				<p className="mt-2 text-sm text-muted-foreground">{description}</p>

				{onRetry && (
					<button
						type="button"
						onClick={onRetry}
						className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
					>
						<RefreshCcw className="size-4" />
						Try again
					</button>
				)}
			</div>
		</div>
	);
}
