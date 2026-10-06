import type { Metadata } from "next";

import { RecruiterApplicationDetailsView } from "@/modules/application/views/recruiter-application-details-view";

export const metadata: Metadata = {
	title: "Application Review",
	description: "Review candidate application details.",
};

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function RecruiterApplicationPage({ params }: Props) {
	const { id } = await params;

	return <RecruiterApplicationDetailsView applicationId={id} />;
}
