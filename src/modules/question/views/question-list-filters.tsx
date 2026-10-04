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
import { DIFFICULTY_LEVELS, type DifficultyLevel } from "@/types/assessment.types";
import { QUESTION_TYPES, type QuestionSortField, type QuestionType } from "@/types/question.types";
import type { QueryParamValue } from "@/utils/query-params";

type QuestionListFiltersProps = {
	search: string;
	type?: QuestionType;
	difficulty?: DifficultyLevel;
	sortBy: QuestionSortField;
	sortOrder: "asc" | "desc";

	onSearch: (value: string) => void;
	onSortChange: (value: string) => void;

	replaceQuery: (updates: Record<string, QueryParamValue>) => void;
};

function label(value: string) {
	return value
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/^\w/, (char) => char.toUpperCase());
}

export function QuestionListFilters({
	search,
	type,
	difficulty,
	sortBy,
	sortOrder,
	onSearch,
	onSortChange,
	replaceQuery,
}: QuestionListFiltersProps) {
	return (
		<div className="flex flex-col gap-3 lg:flex-row">
			<div className="relative min-w-0 flex-1">
				<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

				<Input
					key={search}
					defaultValue={search}
					placeholder="Search questions"
					className="pl-9"
					onChange={(event) => onSearch(event.target.value)}
				/>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				<Select
					value={type ?? "ALL"}
					onValueChange={(value) =>
						replaceQuery({
							type: value === "ALL" ? null : value,
							page: 1,
						})
					}
				>
					<SelectTrigger className="w-full sm:w-36">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="ALL">All types</SelectItem>

						{QUESTION_TYPES.map((item) => (
							<SelectItem key={item} value={item}>
								{label(item)}
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
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="ALL">All levels</SelectItem>

						{DIFFICULTY_LEVELS.map((item) => (
							<SelectItem key={item} value={item}>
								{label(item)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={`${sortBy}:${sortOrder}`} onValueChange={onSortChange}>
					<SelectTrigger className="col-span-2 w-full sm:col-span-1 sm:w-40">
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="createdAt:desc">Newest</SelectItem>

						<SelectItem value="updatedAt:desc">Recently updated</SelectItem>

						<SelectItem value="defaultMarks:desc">Highest marks</SelectItem>

						<SelectItem value="difficulty:asc">Difficulty</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
