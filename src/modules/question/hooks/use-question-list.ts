"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { questionService } from "@/modules/question/services/question.service";
import { DIFFICULTY_LEVELS, type DifficultyLevel } from "@/types/assessment.types";
import {
	QUESTION_SORT_FIELDS,
	QUESTION_TYPES,
	type QuestionSortField,
	type QuestionType,
} from "@/types/question.types";
import type { QueryParamValue } from "@/utils/query-params";
import { parsePositiveInteger, updateQueryParams } from "@/utils/query-params";

const PAGE_LIMIT = 10;

function isQuestionType(value: string | null): value is QuestionType {
	return value !== null && QUESTION_TYPES.some((type) => type === value);
}

function isDifficulty(value: string | null): value is DifficultyLevel {
	return value !== null && DIFFICULTY_LEVELS.some((item) => item === value);
}

function isSortField(value: string | null): value is QuestionSortField {
	return value !== null && QUESTION_SORT_FIELDS.some((item) => item === value);
}

export function useQuestionList() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { user, status: authStatus } = useAuth();

	const page = parsePositiveInteger(searchParams.get("page"), 1);

	const search = searchParams.get("search") ?? "";

	const typeParam = searchParams.get("type");

	const difficultyParam = searchParams.get("difficulty");

	const sortByParam = searchParams.get("sortBy");

	const type = isQuestionType(typeParam) ? typeParam : undefined;

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
			...QUERY_KEYS.QUESTIONS,
			{
				page,
				limit: PAGE_LIMIT,
				search: search || undefined,
				type,
				difficulty,
				sortBy,
				sortOrder,
			},
		],

		queryFn: () =>
			questionService.getAll({
				page,
				limit: PAGE_LIMIT,
				search: search || undefined,
				type,
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

	return {
		query,

		page,
		search,
		type,
		difficulty,
		sortBy,
		sortOrder,

		hasFilters: Boolean(search || type || difficulty),

		replaceQuery,
		handleSearch,
		handleSortChange,
	};
}
