import { create } from "zustand";

import type { AssessmentBuilderValues } from "@/modules/assessment/schemas/assessment.schema";

export type AssessmentBuilderStep = 1 | 2 | 3;

const INITIAL_VALUES: AssessmentBuilderValues = {
	title: "",
	jobRole: "",
	skills: "",
	difficulty: "INTERMEDIATE",

	durationMinutes: 60,
	passPercentage: 50,
	suspiciousThreshold: 3,

	applicationDeadline: "",
	opensAt: "",
	closesAt: "",
};

type AssessmentBuilderState = {
	step: AssessmentBuilderStep;

	values: AssessmentBuilderValues;

	setStep: (step: AssessmentBuilderStep) => void;

	setValues: (values: Partial<AssessmentBuilderValues>) => void;

	reset: () => void;
};

export const useAssessmentBuilderStore = create<AssessmentBuilderState>((set) => ({
	step: 1,

	values: {
		...INITIAL_VALUES,
	},

	setStep: (step) => {
		set({
			step,
		});
	},

	setValues: (values) => {
		set((state) => ({
			values: {
				...state.values,
				...values,
			},
		}));
	},

	reset: () => {
		set({
			step: 1,
			values: {
				...INITIAL_VALUES,
			},
		});
	},
}));
