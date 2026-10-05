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
		},
	});

	const onSubmit = async (values: ApplyAssessmentValues) => {
		try {
			await applicationService.apply({
				assessmentId,

				coverNote: values.coverNote.trim() || null,
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

					<DialogDescription>Add an optional note for the recruiter.</DialogDescription>
				</DialogHeader>

				<form id="apply-assessment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-2">
					<Label htmlFor="coverNote">Cover note</Label>

					<Textarea
						id="coverNote"
						rows={6}
						maxLength={5000}
						placeholder="Briefly introduce your relevant experience."
						disabled={isSubmitting}
						aria-invalid={Boolean(errors.coverNote)}
						{...register("coverNote")}
					/>

					{errors.coverNote && (
						<p className="text-sm text-destructive">{errors.coverNote.message}</p>
					)}
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
