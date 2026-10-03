"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatEnumLabel } from "@/modules/assessment/utils/format-enum-label";
import {
	ASSESSMENT_STATUSES,
	type AssessmentListParams,
	DIFFICULTY_LEVELS,
} from "@/types/assessment.types";
import type { QueryParamValue } from "@/utils/query-params";

type AssessmentListFiltersProps = Pick<
	AssessmentListParams,
	"status" | "difficulty" | "sortBy" | "sortOrder"
> & {
	search: string;
	handleSearch: (value: string) => void;
	handleSortChange: (value: string) => void;
	replaceQuery: (updates: Record<string, QueryParamValue>) => void;
};

export function AssessmentListFilters({
	search,
	status,
	difficulty,
	sortBy,
	sortOrder,
	handleSearch,
	handleSortChange,
	replaceQuery,
}: AssessmentListFiltersProps) {
	return (
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
	);
}
