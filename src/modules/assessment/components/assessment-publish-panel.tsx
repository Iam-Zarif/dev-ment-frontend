"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { PublishReadiness } from "@/types/assessment.types";

type Props = {
	readiness: PublishReadiness | null;
	publishing: boolean;

	onPublish: () => Promise<void>;
};

export function AssessmentPublishPanel({ readiness, publishing, onPublish }: Props) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	if (!readiness) {
		return null;
	}

	return (
		<>
			<Card>
				<CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="font-heading font-semibold">
							{readiness.canPublish ? "Ready to publish" : "Not ready to publish"}
						</h2>

						{readiness.canPublish ? (
							<p className="mt-1 text-sm text-muted-foreground">
								Publishing uses one assessment credit and locks question editing.
							</p>
						) : (
							<ul className="mt-2 space-y-1 text-sm text-muted-foreground">
								{readiness.issues.map((issue) => (
									<li key={issue.code ?? issue.message}>• {issue.message}</li>
								))}
							</ul>
						)}
					</div>

					<Button
						type="button"
						disabled={!readiness.canPublish || publishing}
						onClick={() => setConfirmOpen(true)}
					>
						{publishing ? <Spinner className="size-4" /> : <Send className="size-4" />}
						Publish
					</Button>
				</CardContent>
			</Card>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Publish assessment?"
				description="One assessment credit will be consumed. After publishing, the assessment questions can no longer be modified."
				confirmLabel="Publish"
				loading={publishing}
				onConfirm={onPublish}
			/>
		</>
	);
}
