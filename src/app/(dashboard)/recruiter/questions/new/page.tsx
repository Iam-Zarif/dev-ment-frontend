import type { Metadata } from "next";

import { QuestionCreateView } from "@/modules/question/views/question-create-view";

export const metadata: Metadata = {
	title: "Create Question",
	description: "Create a question for the assessment question bank.",
};

export default function NewQuestionPage() {
	return <QuestionCreateView />;
}
