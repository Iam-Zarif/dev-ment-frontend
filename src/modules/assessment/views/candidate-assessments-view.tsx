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
import { CandidateAssessmentCard } from "@/modules/assessment/components/candidate-assessment-card";
import { useCandidateAssessments } from "@/modules/assessment/hooks/use-candidate-assessments";
import { DIFFICULTY_LEVELS } from "@/types/assessment.types";
import { formatError } from "@/utils/format-error";

export function CandidateAssessmentsView() {
	const { query, page, search, difficulty, hasFilters, replaceQuery, handleSearch } =
		useCandidateAssessments();

	if (query.isPending) {
		return <PageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<PageHeader title="Assessments" description="Find assessments that match your skills." />

			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

					<Input
						key={search}
						defaultValue={search}
						placeholder="Search assessments"
						className="pl-9"
						onChange={(event) => handleSearch(event.target.value)}
					/>
				</div>

				<Select
					value={difficulty ?? "ALL"}
					onValueChange={(value) =>
						replaceQuery({
							difficulty: value === "ALL" ? null : value,
							page: 1,
						})
					}
				>
					<SelectTrigger className="w-full sm:w-48">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="ALL">All difficulties</SelectItem>

						{DIFFICULTY_LEVELS.map((level) => (
							<SelectItem key={level} value={level}>
								{level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{query.isError ? (
				<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
			) : query.data.items.length === 0 ? (
				<EmptyState
					title={hasFilters ? "No matching assessments" : "No assessments available"}
					description={
						hasFilters
							? "Try adjusting your search or difficulty filter."
							: "Published assessments will appear here."
					}
				/>
			) : (
				<div className="space-y-5">
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{query.data.items.map((assessment) => (
							<CandidateAssessmentCard key={assessment.id} assessment={assessment} />
						))}
					</div>

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
