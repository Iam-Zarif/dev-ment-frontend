// src/app/(dashboard)/recruiter/evaluations/page.tsx

import type { Metadata } from "next";

import { RecruiterEvaluationsView } from "@/modules/evaluation/views/recruiter-evaluations-view";

export const metadata: Metadata = {
	title: "Evaluations",
};

export default function Page() {
	return <RecruiterEvaluationsView />;
}
