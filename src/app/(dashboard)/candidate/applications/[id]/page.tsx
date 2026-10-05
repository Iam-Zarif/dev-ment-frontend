import type { Metadata } from "next";

import { CandidateApplicationDetailsView } from "@/modules/application/views/candidate-application-details-view";

export const metadata: Metadata = {
	title: "Application Details",
	description: "Review your assessment application status.",
};

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function CandidateApplicationPage({ params }: Props) {
	const { id } = await params;

	return <CandidateApplicationDetailsView applicationId={id} />;
}
