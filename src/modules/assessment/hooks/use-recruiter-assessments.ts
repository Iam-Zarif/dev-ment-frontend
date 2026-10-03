"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
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

export function useRecruiterAssessments() {
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
	const sortOrder: "asc" | "desc" = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
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

	return {
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
	};
}
