import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

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

	return (
		<div className="space-y-6">
			<Button asChild variant="outline" size="sm">
				<Link href={ROUTES.RECRUITER_ASSESSMENTS}>
					<ArrowLeft className="size-4" />
					Back to assessments
				</Link>
			</Button>
			<AssessmentDetailsView assessmentId={id} />
		</div>
	);
}
