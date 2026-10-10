"use client";

import { useQuery } from "@tanstack/react-query";
import {
	ArrowRight, ClipboardList, CreditCard, FileText, Plus,
	ShieldCheck, UsersRound,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/data-display/page-header";
import { StatCard } from "@/components/data-display/stat-card";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QUERY_KEYS, ROUTES } from "@/lib/constants";
import { dashboardService } from "@/modules/dashboard/services/dashboard.service";
import { formatRelativeTime } from "@/utils/format-date";
import { formatError } from "@/utils/format-error";

export function RecruiterDashboardView() {
	const query = useQuery({
		queryKey: [...QUERY_KEYS.DASHBOARD, "recruiter"],
		queryFn: dashboardService.getRecruiter,
		staleTime: 30_000,
	});

	if (query.isPending) return <PageSkeleton />;
	if (query.isError) {
		return <ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />;
	}

	const { company, stats, recentAssessments, recentApplications } = query.data;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Recruiter overview"
				description={`${company.name} · Your assessments and candidate activity`}
				action={
					<Button asChild>
						<Link href={ROUTES.RECRUITER_ASSESSMENTS_NEW}>
							<Plus className="size-4" /> New assessment
						</Link>
					</Button>
				}
			/>

			{!company.isVerified && (
				<Card>
					<CardContent className="text-sm text-muted-foreground">
						Your company is awaiting verification. Contact the platform admin if you cannot publish assessments.
					</CardContent>
				</Card>
			)}

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<StatCard title="Total assessments" value={stats.assessments} icon={ClipboardList}
					description={`${stats.drafts} draft · ${stats.published} published`} />
				<StatCard title="Published" value={stats.published} icon={ShieldCheck} />
				<StatCard title="Applications" value={stats.applications} icon={UsersRound} />
				<StatCard title="Awaiting review" value={stats.awaitingReview} icon={FileText} />
				<StatCard title="Pending evaluations" value={stats.pendingEvaluations} icon={ShieldCheck} />
				<StatCard title="Available credits" value={stats.availableCredits} icon={CreditCard}
					description="Unexpired credits remaining" />
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader className="grid grid-cols-[1fr_auto] items-center gap-2">
						<CardTitle>Recent assessments</CardTitle>
						<Link href={ROUTES.RECRUITER_ASSESSMENTS}
							className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
							View all <ArrowRight className="size-3" />
						</Link>
					</CardHeader>
					<CardContent>
						{recentAssessments.length === 0 ? (
							<p className="py-8 text-center text-sm text-muted-foreground">
								No assessments yet. Create your first assessment to get started.
							</p>
						) : (
							<ul className="divide-y">
								{recentAssessments.map((item) => (
									<li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
										<div className="min-w-0">
											<Link href={ROUTES.RECRUITER_ASSESSMENT(item.id)}
												className="block truncate font-medium hover:underline">
												{item.title || "Untitled assessment"}
											</Link>
											<p className="mt-1 text-xs text-muted-foreground">
												{item._count.applications} applications · Updated {formatRelativeTime(item.updatedAt)}
											</p>
										</div>
										<Badge variant={item.status === "PUBLISHED" ? "default" : "secondary"}>
											{item.status}
										</Badge>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="grid grid-cols-[1fr_auto] items-center gap-2">
						<CardTitle>Recent applications</CardTitle>
						<Link href={ROUTES.RECRUITER_APPLICATIONS}
							className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
							View all <ArrowRight className="size-3" />
						</Link>
					</CardHeader>
					<CardContent>
						{recentApplications.length === 0 ? (
							<p className="py-8 text-center text-sm text-muted-foreground">
								Candidate applications will appear here.
							</p>
						) : (
							<ul className="divide-y">
								{recentApplications.map((item) => (
									<li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
										<div className="min-w-0">
											<Link href={ROUTES.RECRUITER_APPLICATION(item.id)}
												className="block truncate font-medium hover:underline">
												{item.candidateName}
											</Link>
											<p className="mt-1 truncate text-xs text-muted-foreground">
												{item.assessment.title} · {formatRelativeTime(item.appliedAt)}
											</p>
										</div>
										<Badge variant="outline">{item.status}</Badge>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-wrap gap-3">
				<Button asChild variant="outline">
					<Link href={ROUTES.RECRUITER_QUESTIONS}>Question bank <ArrowRight className="size-4" /></Link>
				</Button>
				<Button asChild variant="outline">
					<Link href={ROUTES.RECRUITER_EVALUATIONS}>Evaluations <ArrowRight className="size-4" /></Link>
				</Button>
				<Button asChild variant="outline">
					<Link href={ROUTES.RECRUITER_BILLING}>Billing <ArrowRight className="size-4" /></Link>
				</Button>
			</div>
		</div>
	);
}
