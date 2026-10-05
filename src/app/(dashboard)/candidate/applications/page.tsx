import type { Metadata } from "next";

import { CandidateApplicationsView } from "@/modules/application/views/candidate-applications-view";

export const metadata: Metadata = {
	title: "My Applications",
	description: "Track your developer assessment applications.",
};

export default function CandidateApplicationsPage() {
	return <CandidateApplicationsView />;
}
