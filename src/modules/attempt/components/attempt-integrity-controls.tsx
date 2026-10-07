"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAttemptProctor } from "@/modules/attempt/hooks/use-attempt-proctor";
import type { ProctorEventInput } from "@/types/attempt.types";

export function AttemptIntegrityControls({
	active,
	onRecord,
}: {
	active: boolean;
	onRecord: (input: ProctorEventInput) => Promise<unknown>;
}) {
	const { fullscreenActive, enterFullscreen } = useAttemptProctor({ active, onRecord });
	return (
		<div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
			<p className="text-sm text-muted-foreground">
				Tab changes, window blur and fullscreen exits are recorded during this assessment.
			</p>
			<Button
				variant="outline"
				disabled={!active || fullscreenActive}
				onClick={async () => {
					if (!(await enterFullscreen())) toast.error("Fullscreen is unavailable in this browser.");
				}}
			>
				{fullscreenActive ? "Fullscreen active" : "Enter fullscreen"}
			</Button>
		</div>
	);
}
