import { Skeleton } from "./skeleton";

type TableSkeletonProps = {
	rows?: number;
};

export function TableSkeleton({ rows = 6 }: TableSkeletonProps) {
	return (
		<div className="overflow-hidden rounded-xl border bg-card">
			<div className="border-b p-4">
				<Skeleton className="h-9 w-full max-w-sm" />
			</div>

			<div className="divide-y">
				{Array.from({ length: rows }).map((_, index) => (
					<div
						key={index}
						className="grid grid-cols-4 gap-4 p-4"
					>
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-3/4" />
						<Skeleton className="h-5 w-1/2" />
					</div>
				))}
			</div>
		</div>
	);
}