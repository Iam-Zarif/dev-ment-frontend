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
import { AssessmentListFilters } from "@/modules/assessment/components/assessment-list-filters";
import { AssessmentListTable } from "@/modules/assessment/components/assessment-list-table";
import { useRecruiterAssessments } from "@/modules/assessment/hooks/use-recruiter-assessments";
import { formatError } from "@/utils/format-error";

export function RecruiterAssessmentsView() {
  const {
    query,
    search,
    status,
    difficulty,
    sortBy,
    sortOrder,
    hasFilters,
    replaceQuery,
    handleSearch,
    handleSortChange,
  } = useRecruiterAssessments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        action={
          <Button asChild>
            <Link href={ROUTES.RECRUITER_ASSESSMENTS_NEW}>
              <Plus className="size-4" />
              New assessment
            </Link>
          </Button>
        }
      />

      <AssessmentListFilters
        search={search}
        status={status}
        difficulty={difficulty}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSearch={handleSearch}
        handleSortChange={handleSortChange}
        replaceQuery={replaceQuery}
      />

      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <ErrorState
          description={formatError(query.error)}
          onRetry={() => void query.refetch()}
        />
      ) : query.data.items.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No matching assessments" : "No assessments yet"}
          description={
            hasFilters ? "Adjust your search or filters." : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          <AssessmentListTable items={query.data.items} />

          <DataPagination
            page={query.data.meta.page}
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
