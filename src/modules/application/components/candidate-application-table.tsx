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
import { ApplicationStatusBadge } from "@/modules/application/components/application-status-badge";
import { formatEnumLabel } from "@/modules/assessment/utils/format-enum-label";
import type { CandidateApplication } from "@/types/application.types";
import { formatRelativeTime } from "@/utils/format-date";

export function CandidateApplicationTable({ items }: { items: CandidateApplication[] }) {
	return (
		<div className="overflow-hidden rounded-xl border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Assessment</TableHead>

						<TableHead>Company</TableHead>

						<TableHead>Status</TableHead>

						<TableHead>Difficulty</TableHead>

						<TableHead>Applied</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{items.map((application) => (
						<TableRow key={application.id}>
							<TableCell>
								<Link
									href={ROUTES.CANDIDATE_APPLICATION(application.id)}
									className="font-medium hover:underline"
								>
									{application.assessment.title}
								</Link>

								<p className="mt-1 text-xs text-muted-foreground">
									{application.assessment.jobRole}
								</p>
							</TableCell>

							<TableCell>{application.assessment.company.name}</TableCell>

							<TableCell>
								<ApplicationStatusBadge status={application.status} />
							</TableCell>

							<TableCell>
								<Badge variant="outline">
									{formatEnumLabel(application.assessment.difficulty)}
								</Badge>
							</TableCell>

							<TableCell className="text-muted-foreground">
								{formatRelativeTime(application.appliedAt)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
