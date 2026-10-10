import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/lib/constants";
import { formatEnumLabel } from "@/modules/assessment/utils/format-enum-label";
import type { RecruiterAssessment } from "@/types/assessment.types";
import { formatRelativeTime } from "@/utils/format-date";

const STATUS_VARIANTS = {
	DRAFT: "secondary",
	PUBLISHED: "default",
	CLOSED: "outline",
	ARCHIVED: "secondary",
} as const;

export function AssessmentListTable({ items }: { items: RecruiterAssessment[] }) {
	return (
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

						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{items.map((assessment) => (
						<TableRow key={assessment.id}>
							<TableCell className="min-w-52 whitespace-normal">
								<Link
									href={ROUTES.RECRUITER_ASSESSMENT(assessment.id)}
									className="font-medium hover:underline"
								>
									{assessment.title || "Untitled assessment"}
								</Link>

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
						<TableCell>
							<div className="flex flex-wrap items-center gap-3 text-sm">
								{assessment.status === "DRAFT" && !assessment.creditConsumedAt ? (
									<>
										<Link href={ROUTES.RECRUITER_ASSESSMENT_EDIT(assessment.id)}
											className="font-medium text-primary hover:underline">
											Edit details
										</Link>
										<Link href={ROUTES.RECRUITER_ASSESSMENT(assessment.id)}
											className="font-medium text-primary hover:underline">
											Questions / Publish
										</Link>
									</>
								) : (
									<Link href={ROUTES.RECRUITER_ASSESSMENT(assessment.id)}
										className="font-medium text-primary hover:underline">
										View
									</Link>
								)}
							</div>
						</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
