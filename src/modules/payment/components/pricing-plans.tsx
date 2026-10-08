"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, ROUTES, USER_ROLES } from "@/lib/constants";
import { paymentService } from "@/modules/payment/services/payment.service";
import { formatError } from "@/utils/format-error";

function money(value: number | string, currency: string) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency.toUpperCase(),
	}).format(Number(value));
}

export function PricingPlans() {
	const router = useRouter();

	const { user } = useAuth();

	const query = useQuery({
		queryKey: [...QUERY_KEYS.PAYMENTS, "plans"],

		queryFn: paymentService.getPlans,
	});

	const checkoutMutation = useMutation({
		mutationFn: (planCode: string) => paymentService.checkout(planCode),

		onSuccess: (result) => {
			window.location.assign(result.checkoutUrl);
		},
	});

	if (query.isPending) {
		return <PageSkeleton />;
	}

	if (query.isError) {
		return <p className="text-sm text-destructive">{formatError(query.error)}</p>;
	}

	return (
		<div className="grid gap-5 md:grid-cols-3">
			{query.data.map((plan) => (
				<Card key={plan.id}>
					<CardHeader>
						<CardTitle>{plan.name}</CardTitle>

						<p className="text-3xl font-semibold">{money(plan.price, plan.currency)}</p>
					</CardHeader>

					<CardContent className="space-y-3 text-sm">
						<p className="flex gap-2">
							<Check className="size-4 text-primary" />
							{plan.assessmentCredits} assessment credits
						</p>

						<p className="flex gap-2">
							<Check className="size-4 text-primary" />
							Valid for {plan.validityDays} days
						</p>
					</CardContent>

					<CardFooter>
						<Button
							className="w-full"
							disabled={checkoutMutation.isPending}
							onClick={() => {
								if (user?.role !== USER_ROLES.RECRUITER) {
									router.push(ROUTES.LOGIN);

									return;
								}

								checkoutMutation.mutate(plan.code, {
									onError: (error) => toast.error(formatError(error)),
								});
							}}
						>
							Buy plan
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
