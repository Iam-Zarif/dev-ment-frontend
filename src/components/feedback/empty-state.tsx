import {
	Inbox,
	type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
	title: string;
	description?: string;
	icon?: LucideIcon;
	action?: ReactNode;
	className?: string;
};

export function EmptyState({
	title,
	description,
	icon: Icon = Inbox,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center",
				className,
			)}
		>
			<div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
				<Icon className="size-5" />
			</div>

			<h3 className="mt-4 font-heading text-lg font-medium">
				{title}
			</h3>

			{description && (
				<p className="mt-2 max-w-md text-sm text-muted-foreground">
					{description}
				</p>
			)}

			{action && (
				<div className="mt-5">
					{action}
				</div>
			)}
		</div>
	);
}