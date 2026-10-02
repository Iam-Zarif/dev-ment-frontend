import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
	return (
		<div className="rounded-xl border bg-card p-5">
			<div className="space-y-3">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-3 w-40" />
			</div>
		</div>
	);
}
