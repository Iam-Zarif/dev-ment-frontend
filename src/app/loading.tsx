import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

export default function Loading() {
	return (
		<main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6">
			<DashboardSkeleton />
		</main>
	);
}