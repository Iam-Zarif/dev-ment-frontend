import Link from "next/link";

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
import type { RecruiterApplication } from "@/types/application.types";
import { formatRelativeTime } from "@/utils/format-date";

type RecruiterApplicationTableProps = {
	items: RecruiterApplication[];
};

export function RecruiterApplicationTable({ items }: RecruiterApplicationTableProps) {
	return (
		<div className="overflow-hidden rounded-xl border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Candidate</TableHead>
						<TableHead>Assessment</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Experience</TableHead>
						<TableHead>Applied</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{items.map((application) => (
						<TableRow key={application.id}>
							<TableCell>
								<Link
									href={ROUTES.RECRUITER_APPLICATION(application.id)}
									className="font-medium hover:underline"
								>
									{application.candidate.user.legalName}
								</Link>

								<p className="mt-1 text-xs text-muted-foreground">
									{application.candidate.user.email}
								</p>
							</TableCell>

							<TableCell>
								<p className="font-medium">{application.assessment.title}</p>

								<p className="mt-1 text-xs text-muted-foreground">
									{application.assessment.jobRole}
								</p>
							</TableCell>

							<TableCell>
								<ApplicationStatusBadge status={application.status} />
							</TableCell>

							<TableCell>
								{application.candidate.experienceYears !== null
									? `${application.candidate.experienceYears} yrs`
									: "—"}
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
