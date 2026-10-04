import type { Metadata } from "next";

import { AssessmentDetailsView } from "@/modules/assessment/views/assessment-details-view";

export const metadata: Metadata = {
	title: "Assessment",
	description: "Manage assessment questions.",
};

type AssessmentPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function AssessmentPage({ params }: AssessmentPageProps) {
	const { id } = await params;

	return <AssessmentDetailsView assessmentId={id} />;
}
