"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, USER_ROLES } from "@/lib/constants";
import { applicationService } from "@/modules/application/services/application.service";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/types/application.types";
import type { QueryParamValue } from "@/utils/query-params";
import { parsePositiveInteger, updateQueryParams } from "@/utils/query-params";

const PAGE_LIMIT = 10;

function isApplicationStatus(value: string | null): value is ApplicationStatus {
	return value !== null && APPLICATION_STATUSES.some((status) => status === value);
}

export function useCandidateApplications() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { user, status: authStatus } = useAuth();

	const page = parsePositiveInteger(searchParams.get("page"), 1);

	const search = searchParams.get("search") ?? "";

	const statusParam = searchParams.get("status");

	const status = isApplicationStatus(statusParam) ? statusParam : undefined;

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
			...QUERY_KEYS.APPLICATIONS,
			"mine",
			{
				page,
				limit: PAGE_LIMIT,
				search: search || undefined,
				status,
			},
		],

		queryFn: () =>
			applicationService.getMine({
				page,
				limit: PAGE_LIMIT,
				search: search || undefined,
				status,
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
		status,

		hasFilters: Boolean(search || status),

		replaceQuery,
		handleSearch,
	};
}
