"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { PAGINATION } from "@/lib/constants";
import { parsePositiveInteger, updateQueryParams } from "@/utils/query-params";

type UsePaginationOptions = {
	defaultPage?: number;
	defaultLimit?: number;
};

export function usePagination({
	defaultPage = PAGINATION.DEFAULT_PAGE,
	defaultLimit = PAGINATION.DEFAULT_LIMIT,
}: UsePaginationOptions = {}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const page = parsePositiveInteger(searchParams.get("page"), defaultPage);

	const limit = parsePositiveInteger(searchParams.get("limit"), defaultLimit);

	const updateUrl = useCallback(
		(updates: Record<string, string | number>) => {
			const queryString = updateQueryParams(searchParams.toString(), updates);

			router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
				scroll: false,
			});
		},
		[pathname, router, searchParams],
	);

	const setPage = useCallback(
		(nextPage: number) => {
			updateUrl({
				page: Math.max(1, nextPage),
			});
		},
		[updateUrl],
	);

	const setLimit = useCallback(
		(nextLimit: number) => {
			updateUrl({
				page: 1,
				limit: Math.max(1, nextLimit),
			});
		},
		[updateUrl],
	);

	return {
		page,
		limit,
		setPage,
		setLimit,
	};
}
