// src/app/(dashboard)/recruiter/evaluations/[id]/page.tsx

import type { Metadata } from "next";

import { RecruiterEvaluationDetailsView } from "@/modules/evaluation/views/recruiter-evaluation-details-view";

export const metadata: Metadata = {
	title: "Evaluation Review",
};

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function Page({ params }: Props) {
	const { id } = await params;

	return <RecruiterEvaluationDetailsView attemptId={id} />;
}
