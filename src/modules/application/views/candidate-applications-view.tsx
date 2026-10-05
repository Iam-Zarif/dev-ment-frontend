"use client";

import { Search } from "lucide-react";
import { PageHeader } from "@/components/data-display/page-header";
import { DataPagination } from "@/components/data-display/pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CandidateApplicationTable } from "@/modules/application/components/candidate-application-table";
import { useCandidateApplications } from "@/modules/application/hooks/use-candidate-applications";
import { APPLICATION_STATUSES } from "@/types/application.types";
import { formatError } from "@/utils/format-error";

function statusLabel(value: string) {
	return value
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/^\w/, (character) => character.toUpperCase());
}

export function CandidateApplicationsView() {
	const { query, page, search, status, hasFilters, replaceQuery, handleSearch } =
		useCandidateApplications();

	if (query.isPending) {
		return <PageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="My applications"
				description="Track your assessment applications and recruiter decisions."
			/>

			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

					<Input
						key={search}
						defaultValue={search}
						placeholder="Search applications"
						className="pl-9"
						onChange={(event) => handleSearch(event.target.value)}
					/>
				</div>

				<Select
					value={status ?? "ALL"}
					onValueChange={(value) =>
						replaceQuery({
							status: value === "ALL" ? null : value,
							page: 1,
						})
					}
				>
					<SelectTrigger className="w-full sm:w-44">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="ALL">All statuses</SelectItem>

						{APPLICATION_STATUSES.map((item) => (
							<SelectItem key={item} value={item}>
								{statusLabel(item)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{query.isError ? (
				<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
			) : query.data.items.length === 0 ? (
				<EmptyState
					title={hasFilters ? "No matching applications" : "No applications yet"}
					description={
						hasFilters ? "Try changing your filters." : "Apply to an assessment to see it here."
					}
				/>
			) : (
				<div className="space-y-4">
					<CandidateApplicationTable items={query.data.items} />

					<DataPagination
						page={page}
						totalPages={query.data.meta.totalPages}
						disabled={query.isFetching}
						onPageChange={(nextPage) =>
							replaceQuery({
								page: nextPage,
							})
						}
					/>
				</div>
			)}
		</div>
	);
}
