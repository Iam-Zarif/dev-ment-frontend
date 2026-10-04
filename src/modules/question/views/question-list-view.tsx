"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/data-display/page-header";
import { DataPagination } from "@/components/data-display/pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { useQuestionList } from "@/modules/question/hooks/use-question-list";
import { QuestionListFilters } from "@/modules/question/views/question-list-filters";
import { QuestionListTable } from "@/modules/question/views/question-list-table";
import { formatError } from "@/utils/format-error";

export function QuestionListView() {
	const {
		query,
		page,
		search,
		type,
		difficulty,
		sortBy,
		sortOrder,
		hasFilters,
		replaceQuery,
		handleSearch,
		handleSortChange,
	} = useQuestionList();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Question bank"
				action={
					<Button asChild>
						<Link href={ROUTES.RECRUITER_QUESTIONS_NEW}>
							<Plus className="size-4" />
							New question
						</Link>
					</Button>
				}
			/>

			<QuestionListFilters
				search={search}
				type={type}
				difficulty={difficulty}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSearch={handleSearch}
				onSortChange={handleSortChange}
				replaceQuery={replaceQuery}
			/>

			{query.isPending ? (
				<TableSkeleton />
			) : query.isError ? (
				<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
			) : query.data.items.length === 0 ? (
				<EmptyState
					title={hasFilters ? "No matching questions" : "No questions yet"}
					description={hasFilters ? "Adjust your search or filters." : undefined}
				/>
			) : (
				<div className="space-y-4">
					<QuestionListTable items={query.data.items} />

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
