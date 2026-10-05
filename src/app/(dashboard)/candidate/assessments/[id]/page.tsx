import type { Metadata } from "next";

import { CandidateAssessmentDetailsView } from "@/modules/assessment/views/candidate-assessment-details-view";

export const metadata: Metadata = {
	title: "Assessment Details",
	description: "Review and apply for a developer assessment.",
};

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function CandidateAssessmentPage({ params }: Props) {
	const { id } = await params;

	return <CandidateAssessmentDetailsView assessmentId={id} />;
}
