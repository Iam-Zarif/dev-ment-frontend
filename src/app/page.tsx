import { ArrowRight, ClipboardCheck, ShieldCheck, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
	title: "DevMent — Developer Assessment Platform",
	description: "Create assessments, evaluate candidates and make evidence-based hiring decisions.",
};

export default function HomePage() {
	return (
		<main>
			<section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
				<p className="mb-4 rounded-full border px-4 py-1.5 text-sm">
					Developer Assessment Platform
				</p>

				<h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
					Assess developers with a clear, structured hiring workflow.
				</h1>

				<p className="mt-6 max-w-2xl text-lg text-muted-foreground">
					Build technical assessments, invite candidates, review submissions and release results
					from one platform.
				</p>

				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Button asChild size="lg">
						<Link href={ROUTES.REGISTER}>
							Get started
							<ArrowRight className="size-4" />
						</Link>
					</Button>

					<Button asChild size="lg" variant="outline">
						<Link href={ROUTES.LOGIN}>Sign in</Link>
					</Button>
				</div>
			</section>

			<section className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 md:grid-cols-3">
				{[
					{
						title: "Assessment workflow",

						text: "Draft, publish and manage technical assessments.",

						icon: ClipboardCheck,
					},
					{
						title: "Candidate pipeline",

						text: "Applications, invitations, timed attempts and results.",

						icon: Users,
					},
					{
						title: "Integrity controls",

						text: "Track assessment events and review suspicious attempts.",

						icon: ShieldCheck,
					},
				].map((item) => {
					const Icon = item.icon;

					return (
						<Card key={item.title}>
							<CardContent>
								<Icon className="size-6 text-primary" />

								<h2 className="mt-4 font-semibold">{item.title}</h2>

								<p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
							</CardContent>
						</Card>
					);
				})}
			</section>
		</main>
	);
}
