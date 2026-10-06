import type { Metadata } from "next";

import { ErrorState } from "@/components/feedback/error-state";
import { CandidateInvitationView } from "@/modules/invitation/views/candidate-invitation-view";

export const metadata: Metadata = {
	title: "Assessment Invitation",
	description: "Review your developer assessment invitation.",
};

type Props = {
	searchParams: Promise<{
		token?: string;
	}>;
};

export default async function InvitationPage({ searchParams }: Props) {
	const { token } = await searchParams;

	if (!token) {
		return (
			<div className="mx-auto max-w-2xl py-12">
				<ErrorState description="Invitation token is missing." />
			</div>
		);
	}

	return <CandidateInvitationView token={token} />;
}
