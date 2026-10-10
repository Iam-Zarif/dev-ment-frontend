"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { questionService } from "@/modules/question/services/question.service";
import type { RecruiterQuestion } from "@/types/question.types";

type Props = {
	open: boolean;

	onOpenChange: (open: boolean) => void;

	attachedQuestionIds: string[];

	onAttach: (question: RecruiterQuestion) => Promise<void>;
};

function questionPreview(html: string) {
	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function QuestionPickerDialog({ open, onOpenChange, attachedQuestionIds, onAttach }: Props) {
	const [search, setSearch] = useState("");

	const [attachingId, setAttachingId] = useState<string | null>(null);

	const debouncedSearch = useDebounce(search, 350);

	const query = useQuery({
		queryKey: [...QUERY_KEYS.QUESTIONS, "picker", debouncedSearch],

		queryFn: () =>
			questionService.getAll({
				page: 1,
				limit: 20,

				search: debouncedSearch.trim() || undefined,

				sortBy: "createdAt",
				sortOrder: "desc",
			}),

		enabled: open,
	});

	const attachedIds = new Set(attachedQuestionIds);

	const availableQuestions =
		query.data?.items.filter((question) => !attachedIds.has(question.id)) ?? [];

	const handleAttach = async (question: RecruiterQuestion) => {
		setAttachingId(question.id);

		try {
			await onAttach(question);
		} catch {
			// The parent already reports the API error.
		} finally {
			setAttachingId(null);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Add question</DialogTitle>

					<DialogDescription>Choose from your question bank.</DialogDescription>
				</DialogHeader>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

					<Input
						value={search}
						placeholder="Search question bank"
						className="pl-9"
						onChange={(event) => setSearch(event.target.value)}
					/>
				</div>

				<div className="max-h-96 space-y-2 overflow-y-auto">
					{query.isPending ? (
						<div className="flex min-h-32 items-center justify-center">
							<Spinner />
						</div>
					) : query.isError ? (
						<p className="py-8 text-center text-sm text-destructive">Unable to load questions.</p>
					) : availableQuestions.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted-foreground">
							No available questions.{" "}
							<Link href={ROUTES.RECRUITER_QUESTIONS_NEW} target="_blank"
								rel="noopener noreferrer" className="font-medium text-primary hover:underline">
								Create one in the question bank ↗
							</Link>
						</p>
					) : (
						availableQuestions.map((question) => (
							<div key={question.id} className="flex items-start gap-3 rounded-lg border p-3">
								<div className="min-w-0 flex-1">
									<p className="line-clamp-2 text-sm font-medium">
										{questionPreview(question.contentHtml) || "Untitled question"}
									</p>

									<p className="mt-1 text-xs text-muted-foreground">
										{question.type} • {question.defaultMarks} marks
									</p>
								</div>

								<Button
									type="button"
									size="sm"
									disabled={attachingId !== null}
									onClick={() => void handleAttach(question)}
								>
									{attachingId === question.id ? (
										<Spinner className="size-4" />
									) : (
										<Plus className="size-4" />
									)}
									Add
								</Button>
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
