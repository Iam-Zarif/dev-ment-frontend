"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

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
				<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
					<AlertTriangle className="size-6" />
				</div>

				<h2 className="font-heading text-xl font-semibold">{title}</h2>

				<p className="mt-2 text-sm text-muted-foreground">{description}</p>

				{onRetry && (
					<Button type="button" onClick={onRetry} className="mt-5">
						<RefreshCcw className="size-4" />
						Try again
					</Button>
				)}
			</div>
		</div>
	);
}
