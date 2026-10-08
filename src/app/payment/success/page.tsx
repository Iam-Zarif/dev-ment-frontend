// src/app/payment/success/page.tsx

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

export default function PaymentSuccessPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-lg">
				<CardContent className="flex flex-col items-center gap-4 py-10 text-center">
					<CheckCircle2 className="size-12 text-primary" />

					<h1 className="text-2xl font-semibold">Checkout completed</h1>

					<p className="text-sm text-muted-foreground">
						Stripe is confirming the payment through the secure webhook. Your credits will appear
						automatically after confirmation.
					</p>

					<Button asChild>
						<Link href={ROUTES.RECRUITER_BILLING}>View billing</Link>
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
