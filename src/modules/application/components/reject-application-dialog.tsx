"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

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
import {
	type RejectApplicationValues,
	rejectApplicationSchema,
} from "@/modules/application/schemas/application.schema";

type Props = {
	open: boolean;
	loading: boolean;

	onOpenChange: (open: boolean) => void;

	onReject: (reason?: string) => Promise<void>;
};

export function RejectApplicationDialog({ open, loading, onOpenChange, onReject }: Props) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<RejectApplicationValues>({
		resolver: zodResolver(rejectApplicationSchema),

		defaultValues: {
			rejectionReason: "",
		},
	});

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			reset();
		}

		onOpenChange(nextOpen);
	};

	const onSubmit = async (values: RejectApplicationValues) => {
		await onReject(values.rejectionReason.trim() || undefined);

		reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Reject application</DialogTitle>

					<DialogDescription>You may include a reason for the candidate.</DialogDescription>
				</DialogHeader>

				<form id="reject-application-form" onSubmit={handleSubmit(onSubmit)} className="space-y-2">
					<Label htmlFor="rejectionReason">Reason</Label>

					<Textarea
						id="rejectionReason"
						rows={5}
						maxLength={2000}
						disabled={loading}
						aria-invalid={Boolean(errors.rejectionReason)}
						{...register("rejectionReason")}
					/>

					{errors.rejectionReason && (
						<p className="text-sm text-destructive">{errors.rejectionReason.message}</p>
					)}
				</form>

				<DialogFooter>
					<Button
						type="submit"
						form="reject-application-form"
						variant="destructive"
						disabled={loading}
					>
						{loading && <Loader2 className="size-4 animate-spin" />}
						Reject
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
