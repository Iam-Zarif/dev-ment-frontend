import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
	return (
		<div className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
			<div className="space-y-3">
				<Skeleton className="h-9 w-64 max-w-full" />
				<Skeleton className="h-4 w-96 max-w-full" />
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({
					length: 6,
				}).map((_, index) => (
					<div key={index} className="space-y-4 rounded-xl border bg-card p-5">
						<Skeleton className="h-5 w-2/3" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-4/5" />
						<Skeleton className="h-9 w-28" />
					</div>
				))}
			</div>
		</div>
	);
}
