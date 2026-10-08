"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/data-display/page-header";
import { DataPagination } from "@/components/data-display/pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS } from "@/lib/constants";
import { adminService } from "@/modules/admin/services/admin.service";
import { formatDateTime } from "@/utils/format-date";
import { formatError } from "@/utils/format-error";
import { parsePositiveInteger } from "@/utils/query-params";

export function AdminReportsView() {
	const router = useRouter();
	const params = useSearchParams();

	const page = parsePositiveInteger(params.get("page"), 1);

	const query = useQuery({
		queryKey: [...QUERY_KEYS.ADMIN, "audit", page],

		queryFn: () =>
			adminService.getAuditLogs({
				page,
				limit: 20,
			}),
	});

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError)
		return (
			<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
		);
	return (
		<div className="space-y-6">
			<PageHeader
				title="Audit reports"
				description="Review important platform actions and administrative events."
			/>

			{query.data?.items.length ? (
				<div className="space-y-4">
					<div className="overflow-hidden rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Action</TableHead>

									<TableHead>Entity</TableHead>

									<TableHead>Actor</TableHead>

									<TableHead>Date</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{query.data.items.map((log) => (
									<TableRow key={log.id}>
										<TableCell className="font-medium">{log.action}</TableCell>

										<TableCell>{log.entityType}</TableCell>

										<TableCell>{log.actor?.legalName ?? "System"}</TableCell>

										<TableCell>{formatDateTime(log.createdAt)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<DataPagination
						page={page}
						totalPages={query.data.meta.totalPages}
						onPageChange={(nextPage) => router.replace(`/admin/reports?page=${nextPage}`)}
					/>
				</div>
			) : (
				<EmptyState title="No audit events" description="Audit events will appear here." />
			)}
		</div>
	);
}
