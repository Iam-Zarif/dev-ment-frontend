import type { AttemptAnswer, AttemptQuestion } from "@/types/attempt.types";
export function findAnswer(answers: AttemptAnswer[], assessmentQuestionId: string) {
	return answers.find((answer) => answer.assessmentQuestionId === assessmentQuestionId);
}

export function hasAnswer(question: AttemptQuestion, answer?: AttemptAnswer) {
	if (!answer) {
		return false;
	}

	if (question.type === "MCQ") {
		return answer.selectedOptionIds.length > 0;
	}

	if (question.type === "CODING") {
		return Boolean(answer.codeAnswer?.trim());
	}

	return Boolean(answer.answerText?.trim());
}
