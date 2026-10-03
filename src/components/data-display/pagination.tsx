"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type DataPaginationProps = {
	page: number;
	totalPages: number;
	disabled?: boolean;
	onPageChange: (page: number) => void;
};

export function DataPagination({
	page,
	totalPages,
	disabled = false,
	onPageChange,
}: DataPaginationProps) {
	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className="flex items-center justify-between gap-3">
			<p className="text-sm text-muted-foreground">
				Page {page} of {totalPages}
			</p>

			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={disabled || page <= 1}
					onClick={() => onPageChange(page - 1)}
				>
					<ChevronLeft className="size-4" />
					Previous
				</Button>

				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={disabled || page >= totalPages}
					onClick={() => onPageChange(page + 1)}
				>
					Next
					<ChevronRight className="size-4" />
				</Button>
			</div>
		</div>
	);
}
