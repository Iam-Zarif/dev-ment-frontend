"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { assessmentService } from "@/modules/assessment/services/assessment.service";
import { DIFFICULTY_LEVELS, type DifficultyLevel } from "@/types/assessment.types";
import type { QueryParamValue } from "@/utils/query-params";
import { parsePositiveInteger, updateQueryParams } from "@/utils/query-params";

const PAGE_LIMIT = 9;

function isDifficulty(value: string | null): value is DifficultyLevel {
	return value !== null && DIFFICULTY_LEVELS.some((item) => item === value);
}

export function useCandidateAssessments() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { user, status: authStatus } = useAuth();

	const page = parsePositiveInteger(searchParams.get("page"), 1);

	const search = searchParams.get("search") ?? "";

	const difficultyParam = searchParams.get("difficulty");

	const difficulty = isDifficulty(difficultyParam) ? difficultyParam : undefined;

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
			"published",
			{
				page,
				limit: PAGE_LIMIT,
				search: search || undefined,
				difficulty,
			},
		],

		queryFn: () =>
			assessmentService.getPublished({
				page,
				limit: PAGE_LIMIT,
				search: search || undefined,
				difficulty,
			}),

		enabled: authStatus === "authenticated" && user?.role === USER_ROLES.CANDIDATE,

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

	return {
		query,

		page,
		search,
		difficulty,

		hasFilters: Boolean(search || difficulty),

		replaceQuery,
		handleSearch,
	};
}
