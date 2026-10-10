"use client";

import { useQuery } from "@tanstack/react-query";
import {
	ArrowRight, Award, ClipboardList, Clock3, FileCheck2,
	Mail, SearchCheck,
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

export function CandidateDashboardView() {
	const query = useQuery({
		queryKey: [...QUERY_KEYS.DASHBOARD, "candidate"],
		queryFn: dashboardService.getCandidate,
		staleTime: 30_000,
	});

	if (query.isPending) return <PageSkeleton />;
	if (query.isError) {
		return <ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />;
	}

	const { stats, recentApplications, availableAssessments } = query.data;

	return (
		<div className="space-y-6">
			<PageHeader title="Candidate overview"
				description="Your assessment applications, invitations and results."
				action={
					<Button asChild>
						<Link href={ROUTES.CANDIDATE_ASSESSMENTS}>
							<SearchCheck className="size-4" /> Browse assessments
						</Link>
					</Button>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<StatCard title="Applications" value={stats.applications} icon={ClipboardList} />
				<StatCard title="Shortlisted" value={stats.shortlisted} icon={FileCheck2} />
				<StatCard title="Pending invitations" value={stats.pendingInvitations} icon={Mail}
					description="Invitations awaiting a response" />
				<StatCard title="Active attempts" value={stats.activeAttempts} icon={Clock3} />
				<StatCard title="Released results" value={stats.releasedResults} icon={Award} />
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader className="grid grid-cols-[1fr_auto] items-center gap-2">
						<CardTitle>Recent applications</CardTitle>
						<Link href={ROUTES.CANDIDATE_APPLICATIONS}
							className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
							View all <ArrowRight className="size-3" />
						</Link>
					</CardHeader>
					<CardContent>
						{recentApplications.length === 0 ? (
							<p className="py-8 text-center text-sm text-muted-foreground">
								You have not applied yet. Browse available assessments to get started.
							</p>
						) : (
							<ul className="divide-y">
								{recentApplications.map((item) => (
									<li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
										<div className="min-w-0">
											<Link href={ROUTES.CANDIDATE_APPLICATION(item.id)}
												className="block truncate font-medium hover:underline">
												{item.assessment.title}
											</Link>
											<p className="mt-1 truncate text-xs text-muted-foreground">
												{item.assessment.companyName} · {formatRelativeTime(item.appliedAt)}
											</p>
											{item.invitation?.attempt?.resultReleasedAt && (
												<Link href={ROUTES.CANDIDATE_RESULT(item.invitation.attempt.id)}
													className="mt-1 inline-block text-xs font-medium text-primary hover:underline">
													View released result
												</Link>
											)}
										</div>
										<Badge variant="outline">{item.status}</Badge>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="grid grid-cols-[1fr_auto] items-center gap-2">
						<CardTitle>Open assessments</CardTitle>
						<Link href={ROUTES.CANDIDATE_ASSESSMENTS}
							className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
							Browse all <ArrowRight className="size-3" />
						</Link>
					</CardHeader>
					<CardContent>
						{availableAssessments.length === 0 ? (
							<p className="py-8 text-center text-sm text-muted-foreground">
								There are no open assessments right now.
							</p>
						) : (
							<ul className="divide-y">
								{availableAssessments.map((item) => (
									<li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
										<div className="min-w-0">
											<Link href={ROUTES.CANDIDATE_ASSESSMENT(item.id)}
												className="block truncate font-medium hover:underline">
												{item.title}
											</Link>
											<p className="mt-1 truncate text-xs text-muted-foreground">
												{item.companyName} · {item.jobRole}
											</p>
										</div>
										<Badge variant="secondary">{item.difficulty}</Badge>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
