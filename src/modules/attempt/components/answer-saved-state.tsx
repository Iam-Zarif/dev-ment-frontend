import type { AttemptAnswer } from "@/types/attempt.types";

export function AnswerSavedState({ saving, answer }: { saving: boolean; answer?: AttemptAnswer }) {
	return (
		<p className="text-xs text-muted-foreground">
			{saving ? "Saving..." : answer?.lastSavedAt ? "Saved" : "Not answered"}
		</p>
	);
}
