// src/app/payment/cancel/page.tsx

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

export default function PaymentCancelPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-lg">
				<CardContent className="space-y-5 py-10 text-center">
					<h1 className="text-2xl font-semibold">Checkout cancelled</h1>

					<p className="text-sm text-muted-foreground">
						No purchase was completed. You can return to billing whenever you are ready.
					</p>

					<Button asChild>
						<Link href={ROUTES.RECRUITER_BILLING}>Return to billing</Link>
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
