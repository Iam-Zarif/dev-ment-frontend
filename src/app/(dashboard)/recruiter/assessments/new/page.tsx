import type { Metadata } from "next";

import { AssessmentBuilder } from "@/modules/assessment/views/assessment-builder";

export const metadata: Metadata = {
	title: "Create Assessment",
	description: "Create a developer assessment draft.",
};

export default function NewAssessmentPage() {
	return <AssessmentBuilder />;
}
