"use client";

import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/data-display/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS } from "@/lib/constants";
import { PricingPlans } from "@/modules/payment/components/pricing-plans";
import { paymentService } from "@/modules/payment/services/payment.service";
import { formatDateTime } from "@/utils/format-date";
import { formatError } from "@/utils/format-error";

export function RecruiterBillingView() {
	const creditsQuery = useQuery({
		queryKey: [...QUERY_KEYS.PAYMENTS, "credits"],

		queryFn: paymentService.getCredits,
	});

	const paymentsQuery = useQuery({
		queryKey: [...QUERY_KEYS.PAYMENTS, "mine"],

		queryFn: () =>
			paymentService.getMine({
				page: 1,
				limit: 20,
			}),
	});

	if (creditsQuery.isPending || paymentsQuery.isPending) {
		return <PageSkeleton />;
	}

	if (creditsQuery.isError || paymentsQuery.isError)
		return (
			<ErrorState
				description={formatError(creditsQuery.error ?? paymentsQuery.error)}
				onRetry={() => {
					void creditsQuery.refetch();
					void paymentsQuery.refetch();
				}}
			/>
		);
	return (
		<div className="space-y-8">
			<PageHeader
				title="Billing & credits"
				description="Purchase assessment credits and review your payment history."
			/>

			{creditsQuery.data && (
				<div className="grid gap-4 sm:grid-cols-3">
					<Card>
						<CardContent>
							<p className="text-sm text-muted-foreground">Available</p>

							<p className="mt-1 text-3xl font-semibold">{creditsQuery.data.availableCredits}</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent>
							<p className="text-sm text-muted-foreground">Free</p>

							<p className="mt-1 text-3xl font-semibold">{creditsQuery.data.freeCredits}</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent>
							<p className="text-sm text-muted-foreground">Purchased</p>

							<p className="mt-1 text-3xl font-semibold">{creditsQuery.data.purchasedCredits}</p>
						</CardContent>
					</Card>
				</div>
			)}

			<div>
				<h2 className="mb-4 text-xl font-semibold">Plans</h2>

				<PricingPlans />
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Payment history</h2>

				{paymentsQuery.data?.items.length ? (
					<div className="overflow-hidden rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Plan</TableHead>

									<TableHead>Amount</TableHead>

									<TableHead>Status</TableHead>

									<TableHead>Date</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{paymentsQuery.data.items.map((payment) => (
									<TableRow key={payment.id}>
										<TableCell>{payment.plan.name}</TableCell>

										<TableCell>
											{payment.amount} {payment.currency}
										</TableCell>

										<TableCell>
											<Badge variant="outline">{payment.status}</Badge>
										</TableCell>

										<TableCell>{formatDateTime(payment.createdAt)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<EmptyState
						title="No payments yet"
						description="Your Stripe payments will appear here."
					/>
				)}
			</div>
		</div>
	);
}
