import type { Metadata } from "next";

import { RecruiterAssessmentsView } from "@/modules/assessment/views/recruiter-assessments-view";

export const metadata: Metadata = {
	title: "Assessments",
	description: "Manage recruiter assessments.",
};

export default function RecruiterAssessmentsPage() {
	return <RecruiterAssessmentsView />;
}
