import { Skeleton } from "@/components/ui/skeleton";

type FormSkeletonProps = {
	fields?: number;
};

export function FormSkeleton({ fields = 5 }: FormSkeletonProps) {
	return (
		<div className="w-full max-w-2xl space-y-6">
			{Array.from({
				length: fields,
			}).map((_, index) => (
				<div key={index} className="space-y-2">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-10 w-full" />
				</div>
			))}

			<Skeleton className="h-9 w-32" />
		</div>
	);
}
