// src/app/(public)/pricing/page.tsx

import type { Metadata } from "next";

import { PricingPlans } from "@/modules/payment/components/pricing-plans";

export const metadata: Metadata = {
	title: "Pricing | DevMent",
	description: "Assessment credit plans for hiring teams.",
};

export default function PricingPage() {
	return (
		<main className="mx-auto max-w-6xl px-6 py-20">
			<div className="mb-12 max-w-2xl">
				<h1 className="text-4xl font-semibold tracking-tight">Simple assessment pricing</h1>

				<p className="mt-4 text-muted-foreground">
					Purchase assessment credits securely through Stripe test mode.
				</p>
			</div>

			<PricingPlans />
		</main>
	);
}
