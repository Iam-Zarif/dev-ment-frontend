"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, ClipboardCheck, CreditCard, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/data-display/page-header";
import { StatCard } from "@/components/data-display/stat-card";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/constants";
import { adminService } from "@/modules/admin/services/admin.service";
import { formatError } from "@/utils/format-error";

export function AdminDashboardView() {
	const query = useQuery({
		queryKey: [...QUERY_KEYS.ADMIN, "dashboard"],

		queryFn: adminService.getDashboard,
	});

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return (
			<ErrorState description={formatError(query.error)} onRetry={() => void query.refetch()} />
		);
	}

	const data = query.data;

	const roleData = [
		{
			name: "Admins",
			total: data.users.admins,
		},
		{
			name: "Recruiters",
			total: data.users.recruiters,
		},
		{
			name: "Candidates",
			total: data.users.candidates,
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Admin overview"
				description="Platform-wide usage, assessment and payment health."
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard title="Users" value={data.users.total} icon={Users} />

				<StatCard
					title="Companies"
					value={data.companies.total}
					description={`${data.companies.verified} verified`}
					icon={Building2}
				/>

				<StatCard
					title="Assessments"
					value={data.assessments.total}
					description={`${data.assessments.published} published`}
					icon={ClipboardCheck}
				/>

				<StatCard
					title="Paid payments"
					value={data.payments.paid}
					description={`${data.payments.pending} pending`}
					icon={CreditCard}
				/>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Users by role</CardTitle>
				</CardHeader>

				<CardContent className="h-72">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={roleData}>
							<CartesianGrid vertical={false} />

							<XAxis dataKey="name" />

							<YAxis allowDecimals={false} />

							<Tooltip />

							<Bar dataKey="total" fill="currentColor" className="text-primary" />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>
		</div>
	);
}
