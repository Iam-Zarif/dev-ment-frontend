import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About | DevMent",
	description: "Learn how DevMent supports structured developer assessment.",
};

export default function AboutPage() {
	return (
		<main className="mx-auto max-w-3xl px-6 py-20">
			<h1 className="text-4xl font-semibold">About DevMent</h1>

			<div className="mt-6 space-y-4 leading-7 text-muted-foreground">
				<p>DevMent is a developer assessment platform designed for structured technical hiring.</p>

				<p>
					Recruiters create assessments and review submissions, candidates complete timed
					evaluations, and administrators manage the platform.
				</p>
			</div>
		</main>
	);
}
