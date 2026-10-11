"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QUERY_KEYS } from "@/lib/constants";
import {
	type ApplyAssessmentValues,
	applyAssessmentSchema,
} from "@/modules/application/schemas/application.schema";
import { applicationService } from "@/modules/application/services/application.service";
import { formatError } from "@/utils/format-error";

type Props = {
	assessmentId: string;

	open: boolean;

	onOpenChange: (open: boolean) => void;
};

export function ApplyAssessmentDialog({ assessmentId, open, onOpenChange }: Props) {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ApplyAssessmentValues>({
		resolver: zodResolver(applyAssessmentSchema),

		defaultValues: {
			coverNote: "",
			githubUrl: "",
			linkedinUrl: "",
			portfolioUrl: "",
		},
	});

	const onSubmit = async (values: ApplyAssessmentValues) => {
		try {
			await applicationService.apply({
				assessmentId,
				coverNote: values.coverNote.trim() || null,
				...(values.githubUrl.trim()
					? {
							githubUrl: values.githubUrl.trim(),
						}
					: {}),
				...(values.linkedinUrl.trim()
					? {
							linkedinUrl: values.linkedinUrl.trim(),
						}
					: {}),
				...(values.portfolioUrl.trim()
					? {
							portfolioUrl: values.portfolioUrl.trim(),
						}
					: {}),
			});

			await queryClient.invalidateQueries({
				queryKey: [...QUERY_KEYS.APPLICATIONS, "mine", assessmentId],
			});

			toast.success("Application submitted");

			reset();
			onOpenChange(false);
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Apply for assessment</DialogTitle>

					<DialogDescription>
						Add an optional note and professional links for the recruiter.
					</DialogDescription>
				</DialogHeader>

				<form id="apply-assessment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="githubUrl">GitHub URL</Label>
							<Input
								id="githubUrl"
								type="url"
								placeholder="https://github.com/username"
								disabled={isSubmitting}
								aria-invalid={Boolean(errors.githubUrl)}
								{...register("githubUrl")}
							/>
							{errors.githubUrl && (
								<p className="text-sm text-destructive">{errors.githubUrl.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="linkedinUrl">LinkedIn URL</Label>
							<Input
								id="linkedinUrl"
								type="url"
								placeholder="https://linkedin.com/in/username"
								disabled={isSubmitting}
								aria-invalid={Boolean(errors.linkedinUrl)}
								{...register("linkedinUrl")}
							/>
							{errors.linkedinUrl && (
								<p className="text-sm text-destructive">{errors.linkedinUrl.message}</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="portfolioUrl">Portfolio URL</Label>
						<Input
							id="portfolioUrl"
							type="url"
							placeholder="https://yourportfolio.com"
							disabled={isSubmitting}
							aria-invalid={Boolean(errors.portfolioUrl)}
							{...register("portfolioUrl")}
						/>
						{errors.portfolioUrl && (
							<p className="text-sm text-destructive">{errors.portfolioUrl.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="coverNote">Cover note</Label>
						<Textarea
							id="coverNote"
							rows={5}
							maxLength={5000}
							placeholder="Briefly introduce your relevant experience."
							disabled={isSubmitting}
							aria-invalid={Boolean(errors.coverNote)}
							{...register("coverNote")}
						/>
						{errors.coverNote && (
							<p className="text-sm text-destructive">{errors.coverNote.message}</p>
						)}
					</div>
				</form>

				<DialogFooter>
					<Button type="submit" form="apply-assessment-form" disabled={isSubmitting}>
						{isSubmitting && <Loader2 className="size-4 animate-spin" />}
						Submit application
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
