import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

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

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			<Button asChild variant="outline" size="sm">
				<Link href={ROUTES.CANDIDATE_ASSESSMENTS}>
					<ArrowLeft className="size-4" />
					Back to assessments
				</Link>
			</Button>
			<CandidateAssessmentDetailsView assessmentId={id} />
		</div>
	);
}
