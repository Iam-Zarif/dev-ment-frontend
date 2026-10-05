import { Building2, Clock3, ListChecks } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { formatEnumLabel } from "@/modules/assessment/utils/format-enum-label";
import type { PublishedAssessment } from "@/types/assessment.types";
import { formatDate } from "@/utils/format-date";

export function CandidateAssessmentCard({ assessment }: { assessment: PublishedAssessment }) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-3">
					<div>
						<CardTitle>{assessment.title}</CardTitle>

						<p className="mt-1 text-sm text-muted-foreground">{assessment.jobRole}</p>
					</div>

					<Badge variant="outline">{formatEnumLabel(assessment.difficulty)}</Badge>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="space-y-2 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<Building2 className="size-4" />
						<span>{assessment.company.name}</span>
					</div>

					<div className="flex items-center gap-2">
						<Clock3 className="size-4" />

						<span>{assessment.durationMinutes} minutes</span>
					</div>

					<div className="flex items-center gap-2">
						<ListChecks className="size-4" />

						<span>{assessment._count.assessmentQuestions} questions</span>
					</div>
				</div>

				{assessment.skills.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{assessment.skills.slice(0, 4).map((skill) => (
							<Badge key={skill} variant="secondary">
								{skill}
							</Badge>
						))}
					</div>
				)}

				<p className="text-xs text-muted-foreground">
					Apply by {formatDate(assessment.applicationDeadline)}
				</p>
			</CardContent>

			<CardFooter>
				<Button asChild className="w-full">
					<Link href={ROUTES.CANDIDATE_ASSESSMENT(assessment.id)}>View assessment</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
