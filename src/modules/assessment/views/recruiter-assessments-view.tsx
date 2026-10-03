"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { PageHeader } from "@/components/data-display/page-header";
import { DataPagination } from "@/components/data-display/pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
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
import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { assessmentService } from "@/modules/assessment/services/assessment.service";
import {
	ASSESSMENT_SORT_FIELDS,
	ASSESSMENT_STATUSES,
	type AssessmentSortField,
	type AssessmentStatus,
	DIFFICULTY_LEVELS,
	type DifficultyLevel,
} from "@/types/assessment.types";
import { formatRelativeTime } from "@/utils/format-date";
import { formatError } from "@/utils/format-error";
import type { QueryParamValue } from "@/utils/query-params";
import { parsePositiveInteger, updateQueryParams } from "@/utils/query-params";

const PAGE_LIMIT = 10;

function isAssessmentStatus(value: string | null): value is AssessmentStatus {
	return value !== null && ASSESSMENT_STATUSES.some((status) => status === value);
}

function isDifficulty(value: string | null): value is DifficultyLevel {
	return value !== null && DIFFICULTY_LEVELS.some((difficulty) => difficulty === value);
}

function isSortField(value: string | null): value is AssessmentSortField {
	return value !== null && ASSESSMENT_SORT_FIELDS.some((field) => field === value);
}

function formatEnumLabel(value: string) {
	return value
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/^\w/, (character) => character.toUpperCase());
}

const STATUS_VARIANTS = {
	DRAFT: "secondary",
	PUBLISHED: "default",
	CLOSED: "outline",
	ARCHIVED: "secondary",
} as const;

export function RecruiterAssessmentsView() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { user, status: authStatus } = useAuth();

	const page = parsePositiveInteger(searchParams.get("page"), 1);

	const search = searchParams.get("search") ?? "";

	const statusParam = searchParams.get("status");

	const difficultyParam = searchParams.get("difficulty");

	const sortByParam = searchParams.get("sortBy");

	const status = isAssessmentStatus(statusParam) ? statusParam : undefined;

	const difficulty = isDifficulty(difficultyParam) ? difficultyParam : undefined;

	const sortBy = isSortField(sortByParam) ? sortByParam : "createdAt";
	const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
	const searchTimerRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (searchTimerRef.current !== null) {
				window.clearTimeout(searchTimerRef.current);
			}
		};
	}, []);

	const replaceQuery = (updates: Record<string, QueryParamValue>) => {
		const queryString = updateQueryParams(searchParams.toString(), updates);

		router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
			scroll: false,
		});
	};

	const query = useQuery({
		queryKey: [
			...QUERY_KEYS.ASSESSMENTS,
			{
				page,
				limit: PAGE_LIMIT,
				search: search || undefined,
				status,
				difficulty,
				sortBy,
				sortOrder,
			},
		],

		queryFn: () =>
			assessmentService.getAll({
				page,
				limit: PAGE_LIMIT,
				search: search || undefined,
				status,
				difficulty,
				sortBy,
				sortOrder,
			}),

		enabled: authStatus === "authenticated" && user?.role === USER_ROLES.RECRUITER,

		placeholderData: keepPreviousData,
	});

	const handleSearch = (value: string) => {
		if (searchTimerRef.current !== null) {
			window.clearTimeout(searchTimerRef.current);
		}

		searchTimerRef.current = window.setTimeout(() => {
			replaceQuery({
				search: value.trim() || null,
				page: 1,
			});
		}, 350);
	};

	const handleSortChange = (value: string) => {
		const [nextSortBy, nextSortOrder] = value.split(":");

		replaceQuery({
			sortBy: nextSortBy,
			sortOrder: nextSortOrder,
			page: 1,
		});
	};

	const hasFilters = Boolean(search || status || difficulty);

	return (
		<div className="space-y-6">
			<PageHeader title="Assessments" />

			<div className="flex flex-col gap-3 lg:flex-row">
				<div className="relative min-w-0 flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

					<Input
						key={search}
						defaultValue={search}
						placeholder="Search assessments"
						className="pl-9"
						onChange={(event) => handleSearch(event.target.value)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					<Select
						value={status ?? "ALL"}
						onValueChange={(value) =>
							replaceQuery({
								status: value === "ALL" ? null : value,
								page: 1,
							})
						}
					>
						<SelectTrigger className="w-full sm:w-36">
							<SelectValue placeholder="Status" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="ALL">All statuses</SelectItem>

							{ASSESSMENT_STATUSES.map((item) => (
								<SelectItem key={item} value={item}>
									{formatEnumLabel(item)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={difficulty ?? "ALL"}
						onValueChange={(value) =>
							replaceQuery({
								difficulty: value === "ALL" ? null : value,
								page: 1,
							})
						}
					>
						<SelectTrigger className="w-full sm:w-40">
							<SelectValue placeholder="Difficulty" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="ALL">All levels</SelectItem>

							{DIFFICULTY_LEVELS.map((item) => (
								<SelectItem key={item} value={item}>
									{formatEnumLabel(item)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={`${sortBy}:${sortOrder}`} onValueChange={handleSortChange}>
						<SelectTrigger className="col-span-2 w-full sm:col-span-1 sm:w-40">
							<SelectValue placeholder="Sort" />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="createdAt:desc">Newest</SelectItem>

							<SelectItem value="updatedAt:desc">Recently updated</SelectItem>

							<SelectItem value="title:asc">Title A–Z</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{query.isPending ? (
				<TableSkeleton />
			) : query.isError ? (
				<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
			) : query.data.items.length === 0 ? (
				<EmptyState
					title={hasFilters ? "No matching assessments" : "No assessments yet"}
					description={hasFilters ? "Adjust your search or filters." : undefined}
				/>
			) : (
				<div className="space-y-4">
					<div className="overflow-hidden rounded-xl border bg-card">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Assessment</TableHead>

									<TableHead>Status</TableHead>

									<TableHead>Difficulty</TableHead>

									<TableHead>Duration</TableHead>

									<TableHead>Questions</TableHead>

									<TableHead>Applications</TableHead>

									<TableHead>Updated</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{query.data.items.map((assessment) => (
									<TableRow key={assessment.id}>
										<TableCell className="min-w-52 whitespace-normal">
											<p className="font-medium">{assessment.title || "Untitled assessment"}</p>

											<p className="mt-0.5 text-xs text-muted-foreground">
												{assessment.jobRole || "No job role"}
											</p>
										</TableCell>

										<TableCell>
											<Badge variant={STATUS_VARIANTS[assessment.status]}>
												{formatEnumLabel(assessment.status)}
											</Badge>
										</TableCell>

										<TableCell>
											<Badge variant="outline">{formatEnumLabel(assessment.difficulty)}</Badge>
										</TableCell>

										<TableCell>{assessment.durationMinutes} min</TableCell>

										<TableCell>{assessment._count.assessmentQuestions}</TableCell>

										<TableCell>{assessment._count.applications}</TableCell>

										<TableCell className="text-muted-foreground">
											{formatRelativeTime(assessment.updatedAt)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

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
