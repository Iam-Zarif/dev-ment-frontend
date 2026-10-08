import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "FAQ | DevMent",
};

export default function FaqPage() {
	const questions = [
		{
			q: "Who can create assessments?",
			a: "Recruiter accounts can create, configure and publish assessments.",
		},
		{
			q: "How are candidates invited?",
			a: "Recruiters shortlist applications and issue secure assessment invitations.",
		},
		{
			q: "Are assessment answers saved automatically?",
			a: "Yes. Text and coding responses are autosaved during an active attempt.",
		},
		{
			q: "How are results released?",
			a: "Recruiters review answers, finalize an evaluation and explicitly release the result.",
		},
	];

	return (
		<main className="mx-auto max-w-3xl px-6 py-20">
			<h1 className="text-4xl font-semibold">Frequently asked questions</h1>

			<div className="mt-10 divide-y rounded-xl border">
				{questions.map((item) => (
					<div key={item.q} className="p-6">
						<h2 className="font-semibold">{item.q}</h2>

						<p className="mt-2 text-sm leading-6 text-muted-foreground">{item.a}</p>
					</div>
				))}
			</div>
		</main>
	);
}
