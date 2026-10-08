"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/data-display/page-header";
import { DataPagination } from "@/components/data-display/pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { evaluationService } from "@/modules/evaluation/services/evaluation.service";
import { EVALUATION_STATUSES, type EvaluationStatus } from "@/types/evaluation.types";
import { formatError } from "@/utils/format-error";
import { parsePositiveInteger, updateQueryParams } from "@/utils/query-params";

function isStatus(value: string | null): value is EvaluationStatus {
	return value !== null && EVALUATION_STATUSES.some((status) => status === value);
}

export function RecruiterEvaluationsView() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const page = parsePositiveInteger(searchParams.get("page"), 1);

	const search = searchParams.get("search") ?? "";

	const rawStatus = searchParams.get("status");

	const status = isStatus(rawStatus) ? rawStatus : undefined;

	const replaceQuery = (updates: Record<string, string | number | null>) => {
		const query = updateQueryParams(searchParams.toString(), updates);

		router.replace(query ? `${pathname}?${query}` : pathname, {
			scroll: false,
		});
	};

	const query = useQuery({
		queryKey: [
			...QUERY_KEYS.EVALUATIONS,
			{
				page,
				search,
				status,
			},
		],

		queryFn: () =>
			evaluationService.getAll({
				page,
				limit: 10,
				search: search || undefined,
				status,
			}),

		placeholderData: keepPreviousData,
	});

	if (query.isPending) {
		return <PageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Evaluations"
				description="Review submitted assessment attempts and release results."
			/>

			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

					<Input
						defaultValue={search}
						className="pl-9"
						placeholder="Search candidate"
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								replaceQuery({
									search: event.currentTarget.value || null,

									page: 1,
								});
							}
						}}
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
					<SelectTrigger className="w-full sm:w-48">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="ALL">All statuses</SelectItem>

						{EVALUATION_STATUSES.map((item) => (
							<SelectItem key={item} value={item}>
								{item}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{query.isError ? (
				<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
			) : query.data.items.length === 0 ? (
				<EmptyState
					title="No submitted attempts"
					description="Submitted candidate attempts will appear here."
				/>
			) : (
				<div className="space-y-4">
					<div className="overflow-hidden rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Candidate</TableHead>

									<TableHead>Assessment</TableHead>

									<TableHead>Status</TableHead>

									<TableHead>Score</TableHead>

									<TableHead>Flags</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{query.data.items.map((item) => (
									<TableRow key={item.id}>
										<TableCell>
											<Link
												href={ROUTES.RECRUITER_EVALUATION(item.id)}
												className="font-medium hover:underline"
											>
												{item.invitation.application.candidate.user.legalName}
											</Link>
										</TableCell>

										<TableCell>{item.invitation.application.assessment.title}</TableCell>

										<TableCell>
											<Badge variant="outline">{item.evaluationStatus}</Badge>
										</TableCell>

										<TableCell>{item.percentage !== null ? `${item.percentage}%` : "—"}</TableCell>

										<TableCell>
											{item.isSuspicious ? <Badge variant="destructive">Suspicious</Badge> : "—"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
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
