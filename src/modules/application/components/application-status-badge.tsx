import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/types/application.types";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
	APPLIED: "Applied",
	SHORTLISTED: "Shortlisted",
	REJECTED: "Rejected",
	INVITED: "Invited",
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
	APPLIED:
		"border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",

	SHORTLISTED:
		"border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",

	REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",

	INVITED:
		"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
	return (
		<Badge variant="outline" className={STATUS_STYLES[status]}>
			{STATUS_LABELS[status]}
		</Badge>
	);
}
