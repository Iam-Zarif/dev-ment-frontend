import type { Metadata } from "next";

import { RecruiterApplicationsView } from "@/modules/application/views/recruiter-applications-view";

export const metadata: Metadata = {
	title: "Applications",
	description: "Review candidate assessment applications.",
};

export default function RecruiterApplicationsPage() {
	return <RecruiterApplicationsView />;
}
