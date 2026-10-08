// src/app/(dashboard)/candidate/results/[id]/page.tsx

import type { Metadata } from "next";

import { CandidateResultView } from "@/modules/evaluation/views/candidate-result-view";

export const metadata: Metadata = {
	title: "Assessment Result",
};

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function Page({ params }: Props) {
	const { id } = await params;

	return <CandidateResultView attemptId={id} />;
}
