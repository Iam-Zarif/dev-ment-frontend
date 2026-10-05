import type { Metadata } from "next";

import { CandidateAssessmentsView } from "@/modules/assessment/views/candidate-assessments-view";

export const metadata: Metadata = {
	title: "Available Assessments",
	description: "Browse published developer assessments.",
};

export default function CandidateAssessmentsPage() {
	return <CandidateAssessmentsView />;
}
