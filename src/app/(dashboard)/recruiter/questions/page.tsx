import type { Metadata } from "next";

import { QuestionListView } from "@/modules/question/views/question-list-view";

export const metadata: Metadata = {
	title: "Question Bank",
	description: "Manage assessment questions.",
};

export default function RecruiterQuestionsPage() {
	return <QuestionListView />;
}
