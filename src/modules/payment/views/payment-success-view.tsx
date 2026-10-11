"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, ROUTES, USER_ROLES } from "@/lib/constants";
import { paymentService } from "@/modules/payment/services/payment.service";
import { formatError } from "@/utils/format-error";

const CONFIRMATION_DISPLAY_MS = 3000;
const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]+$/;

export function PaymentSuccessView({ sessionId }: { sessionId: string | null }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { user, status: authStatus } = useAuth();

	const validSessionId =
		sessionId && SESSION_ID_PATTERN.test(sessionId) ? sessionId : null;
	const isRecruiter = authStatus === "authenticated" && user?.role === USER_ROLES.RECRUITER;

	const paymentQuery = useQuery({
		queryKey: [...QUERY_KEYS.PAYMENTS, "checkout-session", validSessionId],
		queryFn: () => {
			if (!validSessionId) {
				throw new Error("Checkout session ID is missing");
			}
			return paymentService.getCheckoutVerification(validSessionId);
		},
		enabled: Boolean(validSessionId) && isRecruiter,
		refetchInterval: (query) => {
			const payment = query.state.data;
			if (
				payment?.status === "FAILED" ||
				payment?.status === "CANCELLED" ||
				payment?.status === "REFUNDED" ||
				(payment?.status === "PAID" && payment.creditGrant)
			) {
				return false;
			}
			return 2000;
		},
		retry: 1,
	});

	const payment = paymentQuery.data;
	const confirmed = payment?.status === "PAID" && Boolean(payment.creditGrant);
	const unsuccessful =
		payment?.status === "FAILED" ||
		payment?.status === "CANCELLED" ||
		payment?.status === "REFUNDED";

	useEffect(() => {
		if (!confirmed) {
			return;
		}

		void queryClient.invalidateQueries({
			queryKey: [...QUERY_KEYS.PAYMENTS, "credits"],
		});
		void queryClient.invalidateQueries({
			queryKey: [...QUERY_KEYS.PAYMENTS, "mine"],
		});

		const redirectTimer = window.setTimeout(() => {
			router.replace(ROUTES.RECRUITER_BILLING);
		}, CONFIRMATION_DISPLAY_MS);

		return () => window.clearTimeout(redirectTimer);
	}, [confirmed, queryClient, router]);

	const heading = confirmed
		? "Payment successful"
		: unsuccessful
			? "Payment was not completed"
			: paymentQuery.isError
				? "Unable to verify payment"
				: !validSessionId
					? "Checkout session not found"
					: "Confirming your payment";

	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-lg">
				<CardContent className="flex flex-col items-center gap-5 py-10 text-center">
					{confirmed ? (
						<CheckCircle2 className="size-12 text-primary" aria-hidden="true" />
					) : unsuccessful || paymentQuery.isError || !validSessionId ? (
						<XCircle className="size-12 text-destructive" aria-hidden="true" />
					) : paymentQuery.isPending || authStatus === "idle" || authStatus === "loading" ? (
						<Loader2 className="size-12 animate-spin text-muted-foreground" aria-hidden="true" />
					) : (
						<Clock3 className="size-12 text-muted-foreground" aria-hidden="true" />
					)}

					<h1 className="text-2xl font-semibold">{heading}</h1>

					{confirmed ? (
						<p className="text-sm text-muted-foreground">
							Your assessment credits have been added. Returning to billing in 3 seconds.
						</p>
					) : authStatus === "unauthenticated" ? (
						<p className="text-sm text-muted-foreground">
							Sign in to your recruiter account to verify this checkout.
						</p>
					) : authStatus === "authenticated" && !isRecruiter ? (
						<p className="text-sm text-muted-foreground">
							Use the recruiter account that made this purchase.
						</p>
					) : unsuccessful ? (
						<p className="text-sm text-muted-foreground">
							No credits were granted for this payment. Check your billing history.
						</p>
					) : paymentQuery.isError ? (
						<p className="text-sm text-muted-foreground">
							{formatError(paymentQuery.error)}. Please check your billing history.
						</p>
					) : !validSessionId ? (
						<p className="text-sm text-muted-foreground">
							We could not identify this checkout. Check billing for your latest payment.
						</p>
					) : (
						<p className="text-sm text-muted-foreground">
							Your checkout has returned from Stripe. Waiting for secure payment confirmation;
							please do not start another purchase.
						</p>
					)}

					<Button asChild variant="outline">
						<Link href={authStatus === "unauthenticated" ? ROUTES.LOGIN : ROUTES.RECRUITER_BILLING}>
							{authStatus === "unauthenticated" ? "Sign in" : "View billing"}
						</Link>
					</Button>
				</CardContent>
			</Card>

			<Dialog open={confirmed} onOpenChange={() => {}}>
				<DialogContent showCloseButton={false} className="text-center">
					<DialogHeader className="items-center">
						<CheckCircle2 className="mb-2 size-14 text-primary" aria-hidden="true" />
						<DialogTitle className="text-xl">Purchase successful!</DialogTitle>
						<DialogDescription>
							Your assessment credits are ready. Redirecting to Billing in 3 seconds...
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</main>
	);
}
