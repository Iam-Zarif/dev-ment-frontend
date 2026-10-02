"use client";

import { AlertTriangle } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

type ConfirmDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;

	title: string;
	description: string;

	confirmLabel?: string;
	cancelLabel?: string;

	destructive?: boolean;
	loading?: boolean;

	onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	destructive = false,
	loading = false,
	onConfirm,
}: ConfirmDialogProps) {
	const handleConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (loading) {
			return;
		}

		try {
			await onConfirm();
			onOpenChange(false);
		} catch {
			// Parent mutation/toast handles the error.
			// Keep dialog open so the user can retry.
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<AlertTriangle className="size-5" />
					</AlertDialogMedia>

					<AlertDialogTitle>{title}</AlertDialogTitle>

					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>

					<AlertDialogAction
						variant={destructive ? "destructive" : "default"}
						disabled={loading}
						onClick={handleConfirm}
					>
						{loading && <Spinner className="mr-1 size-4" />}

						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
