import type { Metadata } from "next";

import { AssessmentBuilder } from "@/modules/assessment/views/assessment-builder";

export const metadata: Metadata = {
	title: "Edit Assessment Draft",
	description: "Edit a draft assessment before publishing.",
};

type Props = {
	params: Promise<{ id: string }>;
};

export default async function EditAssessmentPage({ params }: Props) {
	const { id } = await params;
	return <AssessmentBuilder assessmentId={id} />;
}
