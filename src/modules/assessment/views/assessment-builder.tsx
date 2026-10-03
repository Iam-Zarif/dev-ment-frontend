"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/data-display/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import {
	type AssessmentBuilderValues,
	assessmentBuilderSchema,
	parseAssessmentSkills,
} from "@/modules/assessment/schemas/assessment.schema";
import { assessmentService } from "@/modules/assessment/services/assessment.service";
import {
	type AssessmentBuilderStep,
	useAssessmentBuilderStore,
} from "@/store/assessment-builder.store";
import { DIFFICULTY_LEVELS } from "@/types/assessment.types";
import { formatError } from "@/utils/format-error";

const STEP_LABELS: Record<AssessmentBuilderStep, string> = {
	1: "Basics",
	2: "Rules",
	3: "Schedule",
};

function toIsoOrNull(value: string): string | null {
	if (!value) {
		return null;
	}

	return new Date(value).toISOString();
}

function FieldError({ message }: { message?: string }) {
	if (!message) {
		return null;
	}

	return <p className="text-sm text-destructive">{message}</p>;
}

export function AssessmentBuilder() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { step, values, setStep, setValues, reset } = useAssessmentBuilderStore();

	const {
		register,
		control,
		trigger,
		getValues,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AssessmentBuilderValues>({
		resolver: zodResolver(assessmentBuilderSchema),

		defaultValues: values,

		mode: "onTouched",
	});

	const saveCurrentValues = () => {
		setValues(getValues());
	};

	const handleNext = async () => {
		const fields =
			step === 1
				? (["title", "jobRole", "skills", "difficulty"] as const)
				: (["durationMinutes", "passPercentage", "suspiciousThreshold"] as const);

		const valid = await trigger(fields);

		if (!valid) {
			return;
		}

		saveCurrentValues();

		setStep((step + 1) as AssessmentBuilderStep);
	};

	const handlePrevious = () => {
		saveCurrentValues();

		setStep((step - 1) as AssessmentBuilderStep);
	};

	const onSubmit = async (formValues: AssessmentBuilderValues) => {
		try {
			await assessmentService.createDraft({
				title: formValues.title.trim(),

				jobRole: formValues.jobRole.trim(),

				skills: parseAssessmentSkills(formValues.skills),

				difficulty: formValues.difficulty,

				durationMinutes: formValues.durationMinutes,

				passPercentage: formValues.passPercentage,

				suspiciousThreshold: formValues.suspiciousThreshold,

				applicationDeadline: toIsoOrNull(formValues.applicationDeadline),

				opensAt: toIsoOrNull(formValues.opensAt),

				closesAt: toIsoOrNull(formValues.closesAt),
			});

			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.ASSESSMENTS,
			});

			reset();

			toast.success("Assessment draft created");

			router.replace(`${ROUTES.RECRUITER_ASSESSMENTS}?status=DRAFT`);

			router.refresh();
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	return (
		<div className="mx-auto w-full max-w-2xl space-y-6">
			<PageHeader title="Create assessment" />

			<Card>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<span>Step {step} of 3</span>

							<span>{STEP_LABELS[step]}</span>
						</div>

						<Progress value={(step / 3) * 100} />
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
						{step === 1 && (
							<>
								<div className="space-y-2">
									<Label htmlFor="title">Assessment title</Label>

									<Input
										id="title"
										placeholder="Frontend Engineer Assessment"
										disabled={isSubmitting}
										aria-invalid={Boolean(errors.title)}
										{...register("title")}
									/>

									<FieldError message={errors.title?.message} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="jobRole">Job role</Label>

									<Input
										id="jobRole"
										placeholder="Frontend Engineer"
										disabled={isSubmitting}
										aria-invalid={Boolean(errors.jobRole)}
										{...register("jobRole")}
									/>

									<FieldError message={errors.jobRole?.message} />
								</div>

								<div className="space-y-2">
									<Label>Difficulty</Label>

									<Controller
										control={control}
										name="difficulty"
										render={({ field }) => (
											<Select
												value={field.value}
												onValueChange={field.onChange}
												disabled={isSubmitting}
											>
												<SelectTrigger className="w-full">
													<SelectValue />
												</SelectTrigger>

												<SelectContent>
													{DIFFICULTY_LEVELS.map((difficulty) => (
														<SelectItem key={difficulty} value={difficulty}>
															{difficulty.charAt(0).toUpperCase() +
																difficulty.slice(1).toLowerCase()}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="skills">Skills</Label>

									<Input
										id="skills"
										placeholder="React, TypeScript, Next.js"
										disabled={isSubmitting}
										aria-invalid={Boolean(errors.skills)}
										{...register("skills")}
									/>

									<FieldError message={errors.skills?.message} />
								</div>
							</>
						)}

						{step === 2 && (
							<>
								<div className="space-y-2">
									<Label htmlFor="durationMinutes">Duration (minutes)</Label>

									<Input
										id="durationMinutes"
										type="number"
										min={1}
										max={1440}
										disabled={isSubmitting}
										aria-invalid={Boolean(errors.durationMinutes)}
										{...register("durationMinutes", {
											valueAsNumber: true,
										})}
									/>

									<FieldError message={errors.durationMinutes?.message} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="passPercentage">Pass percentage</Label>

									<Input
										id="passPercentage"
										type="number"
										min={1}
										max={100}
										disabled={isSubmitting}
										aria-invalid={Boolean(errors.passPercentage)}
										{...register("passPercentage", {
											valueAsNumber: true,
										})}
									/>

									<FieldError message={errors.passPercentage?.message} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="suspiciousThreshold">Suspicious event threshold</Label>

									<Input
										id="suspiciousThreshold"
										type="number"
										min={1}
										max={100}
										disabled={isSubmitting}
										aria-invalid={Boolean(errors.suspiciousThreshold)}
										{...register("suspiciousThreshold", {
											valueAsNumber: true,
										})}
									/>

									<FieldError message={errors.suspiciousThreshold?.message} />
								</div>
							</>
						)}

						{step === 3 && (
							<>
								<div className="space-y-2">
									<Label htmlFor="applicationDeadline">Application deadline</Label>

									<Input
										id="applicationDeadline"
										type="datetime-local"
										disabled={isSubmitting}
										aria-invalid={Boolean(errors.applicationDeadline)}
										{...register("applicationDeadline")}
									/>

									<FieldError message={errors.applicationDeadline?.message} />
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="opensAt">Opens at</Label>

										<Input
											id="opensAt"
											type="datetime-local"
											disabled={isSubmitting}
											aria-invalid={Boolean(errors.opensAt)}
											{...register("opensAt")}
										/>

										<FieldError message={errors.opensAt?.message} />
									</div>

									<div className="space-y-2">
										<Label htmlFor="closesAt">Closes at</Label>

										<Input
											id="closesAt"
											type="datetime-local"
											disabled={isSubmitting}
											aria-invalid={Boolean(errors.closesAt)}
											{...register("closesAt")}
										/>

										<FieldError message={errors.closesAt?.message} />
									</div>
								</div>
							</>
						)}

						<div className="flex items-center justify-between gap-3 border-t pt-5">
							{step === 1 ? (
								<Button asChild type="button" variant="ghost">
									<Link href={ROUTES.RECRUITER_ASSESSMENTS}>Cancel</Link>
								</Button>
							) : (
								<Button
									type="button"
									variant="outline"
									disabled={isSubmitting}
									onClick={handlePrevious}
								>
									<ArrowLeft className="size-4" />
									Previous
								</Button>
							)}

							{step < 3 ? (
								<Button type="button" onClick={() => void handleNext()}>
									Continue
									<ArrowRight className="size-4" />
								</Button>
							) : (
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<Loader2 className="size-4 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="size-4" />
											Save draft
										</>
									)}
								</Button>
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
