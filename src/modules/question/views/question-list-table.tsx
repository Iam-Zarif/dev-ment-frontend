import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { RecruiterQuestion } from "@/types/question.types";
import { formatRelativeTime } from "@/utils/format-date";

function label(value: string) {
	return value
		.toLowerCase()
		.replaceAll("_", " ")
		.replace(/^\w/, (char) => char.toUpperCase());
}

function questionPreview(html: string) {
	return html
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function QuestionListTable({ items }: { items: RecruiterQuestion[] }) {
	return (
		<div className="overflow-hidden rounded-xl border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Question</TableHead>

						<TableHead>Type</TableHead>

						<TableHead>Difficulty</TableHead>

						<TableHead>Marks</TableHead>

						<TableHead>Used</TableHead>

						<TableHead>Updated</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{items.map((question) => (
						<TableRow key={question.id}>
							<TableCell className="max-w-md whitespace-normal">
								<p className="line-clamp-2 font-medium">
									{questionPreview(question.contentHtml) || "Untitled question"}
								</p>

								<p className="mt-1 text-xs text-muted-foreground">
									{question.createdByRecruiter.user.legalName}
								</p>
							</TableCell>

							<TableCell>
								<Badge variant="secondary">{label(question.type)}</Badge>
							</TableCell>

							<TableCell>
								<Badge variant="outline">{label(question.difficulty)}</Badge>
							</TableCell>

							<TableCell>{question.defaultMarks}</TableCell>

							<TableCell>{question._count.assessmentQuestions}</TableCell>

							<TableCell className="text-muted-foreground">
								{formatRelativeTime(question.updatedAt)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
