import type { Metadata } from "next";

import { CandidateAttemptView } from "@/modules/attempt/views/candidate-attempt-view";

export const metadata: Metadata = {
	title: "Assessment Attempt",
	description: "Complete your developer assessment.",
};

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function CandidateAttemptPage({ params }: Props) {
	const { id } = await params;

	return <CandidateAttemptView attemptId={id} />;
}
