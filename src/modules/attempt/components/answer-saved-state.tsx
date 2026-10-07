import type { AttemptAnswer } from "@/types/attempt.types";

type Props = {
	saving: boolean;
	dirty?: boolean;
	answer?: AttemptAnswer;
};

export function AnswerSavedState({ saving, dirty = false, answer }: Props) {
	let label = "Not answered";

	if (saving) {
		label = "Saving...";
	} else if (dirty) {
		label = "Unsaved changes";
	} else if (answer?.lastSavedAt) {
		label = "Saved";
	}

	return <p className="text-xs text-muted-foreground">{label}</p>;
}
