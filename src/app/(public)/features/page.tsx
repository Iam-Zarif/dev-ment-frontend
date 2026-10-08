import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Features | DevMent",
};

export default function FeaturesPage() {
	const features = [
		"Assessment builder and question bank",
		"Candidate applications and invitations",
		"Timed attempts with autosave",
		"Assessment integrity tracking",
		"Manual and automatic evaluation",
		"Stripe assessment-credit billing",
		"Role-based administration",
	];

	return (
		<main className="mx-auto max-w-5xl px-6 py-20">
			<h1 className="text-4xl font-semibold">Platform features</h1>

			<div className="mt-10 grid gap-4 md:grid-cols-2">
				{features.map((feature) => (
					<Card key={feature}>
						<CardContent className="font-medium">{feature}</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
}
