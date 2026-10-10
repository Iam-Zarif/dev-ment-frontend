"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/data-display/page-header";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
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


function toLocalDateTime(value: string | null): string {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
		.toISOString()
		.slice(0, 16);
}

function openPicker(input: HTMLInputElement | null) {
	if (!input) return;
	try {
		if (typeof input.showPicker === "function") input.showPicker();
		else input.focus();
	} catch {
		input.focus();
	}
}

type DateTimeFieldProps = {
	id: string;
	value: string;
	disabled: boolean;
	onChange: (value: string) => void;
};

function DateTimeField({ id, value, disabled, onChange }: DateTimeFieldProps) {
	const dateRef = useRef<HTMLInputElement>(null);
	const timeRef = useRef<HTMLInputElement>(null);
	const [date, time = ""] = value.split("T");

	return (
		<div className="grid gap-2 sm:grid-cols-2">
			<div className="flex min-w-0 items-center gap-1">
				<Input
					ref={dateRef}
					id={id}
					type="date"
					value={date}
					disabled={disabled}
					aria-label={`${id} date`}
					className="min-w-0 flex-1"
					onChange={(event) =>
						onChange(event.target.value ? `${event.target.value}T${time || "09:00"}` : "")
					}
				/>
				<Button type="button" variant="outline" size="icon" disabled={disabled}
					aria-label="Open date picker" onClick={() => openPicker(dateRef.current)}>
					<CalendarDays className="size-4" />
				</Button>
			</div>
			<div className="flex min-w-0 items-center gap-1">
				<Input
					ref={timeRef}
					id={`${id}-time`}
					type="time"
					value={date ? time : ""}
					disabled={disabled || !date}
					aria-label={`${id} time`}
					className="min-w-0 flex-1"
					onChange={(event) => {
						if (date && event.target.value) onChange(`${date}T${event.target.value}`);
					}}
				/>
				<Button type="button" variant="outline" size="icon"
					disabled={disabled || !date} aria-label="Open time picker"
					onClick={() => openPicker(timeRef.current)}>
					<Clock3 className="size-4" />
				</Button>
			</div>
		</div>
	);
}

function FieldError({ message }: { message?: string }) {
	if (!message) {
		return null;
	}

	return <p className="text-sm text-destructive">{message}</p>;
}

export function AssessmentBuilder({ assessmentId }: { assessmentId?: string } = {}) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { values, setValues, reset: resetBuilder } = useAssessmentBuilderStore();
	const [step, setStep] = useState<AssessmentBuilderStep>(1);
	const savingRef = useRef(false);
	const existingQuery = useQuery({
		queryKey: [...QUERY_KEYS.ASSESSMENTS, assessmentId],
		queryFn: () => assessmentService.getById(assessmentId!),
		enabled: Boolean(assessmentId),
	});

	const {
		register,
		control,
		trigger,
		getValues,
		handleSubmit,
		reset: resetForm,
		formState: { errors, isSubmitting },
	} = useForm<AssessmentBuilderValues>({
		resolver: zodResolver(assessmentBuilderSchema),

		defaultValues: values,

		mode: "onTouched",
	});

	useEffect(() => {
		const existing = existingQuery.data;
		if (!existing) return;
		resetForm({
			title: existing.title,
			jobRole: existing.jobRole,
			skills: existing.skills.join(", "),
			difficulty: existing.difficulty,
			durationMinutes: existing.durationMinutes,
			passPercentage: Number(existing.passPercentage),
			suspiciousThreshold: existing.suspiciousThreshold,
			applicationDeadline: toLocalDateTime(existing.applicationDeadline),
			opensAt: toLocalDateTime(existing.opensAt),
			closesAt: toLocalDateTime(existing.closesAt),
		});
	}, [existingQuery.data, resetForm]);

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


	const onSave = async (formValues: AssessmentBuilderValues) => {
		// Never save on picker selection, field blur, Enter, or form change.
		if (savingRef.current) return;
		savingRef.current = true;
		try {
			const input = {
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
			};
			if (assessmentId) {
				await assessmentService.syncDraft(assessmentId, input);
				toast.success("Assessment changes saved");
				await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSESSMENTS });
				router.push(ROUTES.RECRUITER_ASSESSMENT(assessmentId));
			} else {
				const draft = await assessmentService.createDraft(input);
				toast.success("Draft saved. Add questions, then publish when ready.");
				await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSESSMENTS });
				resetBuilder();
				router.push(ROUTES.RECRUITER_ASSESSMENT(draft.id));
			}
		} catch (error) {
			toast.error(formatError(error));
		} finally {
			savingRef.current = false;
		}
	};

	if (assessmentId && existingQuery.isPending) return <PageSkeleton />;
	if (assessmentId && existingQuery.isError) {
		return <ErrorState description={formatError(existingQuery.error)} onRetry={() => void existingQuery.refetch()} />;
	}
	if (assessmentId && existingQuery.data?.status !== "DRAFT") {
		return <ErrorState description="Only draft assessments can be edited." />;
	}

	return (
		<div className="mx-auto w-full max-w-2xl space-y-6">
			<PageHeader title={assessmentId ? "Edit assessment draft" : "Create assessment"} />

			<Card>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<span>Step {step} of 4</span>

							<span>{STEP_LABELS[step]}</span>
						</div>

						<Progress value={(step / 4) * 100} />
					</div>

					<form onSubmit={(event) => event.preventDefault()} className="space-y-5" noValidate>
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
								<p className="text-sm text-muted-foreground">Choose a date first, then the time. These fields are optional. Nothing saves until you click the button below.</p>
								<div className="space-y-2">
									<Label htmlFor="applicationDeadline">Application deadline</Label>

									<Controller
							control={control}
							name="applicationDeadline"
							render={({ field }) => (
								<DateTimeField id="applicationDeadline" value={field.value}
									disabled={isSubmitting} onChange={field.onChange} />
							)}
						/>

									<FieldError message={errors.applicationDeadline?.message} />
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="opensAt">Opens at</Label>

										<Controller
							control={control}
							name="opensAt"
							render={({ field }) => (
								<DateTimeField id="opensAt" value={field.value}
									disabled={isSubmitting} onChange={field.onChange} />
							)}
						/>

										<FieldError message={errors.opensAt?.message} />
									</div>

									<div className="space-y-2">
										<Label htmlFor="closesAt">Closes at</Label>

										<Controller
							control={control}
							name="closesAt"
							render={({ field }) => (
								<DateTimeField id="closesAt" value={field.value}
									disabled={isSubmitting} onChange={field.onChange} />
							)}
						/>

										<FieldError message={errors.closesAt?.message} />
									</div>
								</div>
							</>
						)}

						<div className="flex items-center justify-between gap-3 border-t pt-5">
							{step === 1 ? (
								<Button asChild type="button" variant="ghost">
									<Link href={assessmentId ? ROUTES.RECRUITER_ASSESSMENT(assessmentId) : ROUTES.RECRUITER_ASSESSMENTS}>Cancel</Link>
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
								<Button type="button" disabled={isSubmitting} onClick={() => void handleSubmit(onSave)()}>
									{isSubmitting ? (
										<>
											<Loader2 className="size-4 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="size-4" />
											{assessmentId ? "Save changes" : "Save & add questions"}
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
