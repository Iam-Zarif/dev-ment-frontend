"use client";

import { Clock3, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { attemptService } from "@/modules/attempt/services/attempt.service";
import { invitationService } from "@/modules/invitation/services/invitation.service";
import type { CandidateApplication } from "@/types/application.types";
import { formatError } from "@/utils/format-error";

type CandidateApplicationActionData = Pick<
	CandidateApplication,
	"id" | "status" | "invitation"
>;

export function CandidateApplicationActions({
	application,
}: {
	application: CandidateApplicationActionData;
}) {
	const router = useRouter();
	const [starting, setStarting] = useState(false);

	const invitation = application.invitation;
	const attempt = invitation?.attempt;

	const handleStart = async () => {
		if (!invitation || starting) {
			return;
		}

		setStarting(true);

		try {
			if (invitation.status === "PENDING") {
				await invitationService.acceptById(invitation.id);
			}

			const session = await attemptService.start(invitation.id);

			router.push(ROUTES.CANDIDATE_ATTEMPT(session.attempt.id));
		} catch (error) {
			toast.error(formatError(error));
			setStarting(false);
		}
	};

	if (application.status === "APPLIED") {
		return (
			<Button asChild size="sm" variant="outline">
				<Link href={ROUTES.CANDIDATE_APPLICATION(application.id)}>View</Link>
			</Button>
		);
	}

	if (application.status === "SHORTLISTED") {
		return (
			<Button size="sm" variant="outline" disabled>
				<Clock3 className="size-4" />
				Awaiting invitation
			</Button>
		);
	}

	if (application.status === "REJECTED") {
		return (
			<Button asChild size="sm" variant="outline">
				<Link href={ROUTES.CANDIDATE_APPLICATION(application.id)}>View details</Link>
			</Button>
		);
	}

	if (!invitation) {
		return (
			<Button size="sm" variant="outline" disabled>
				Invitation pending
			</Button>
		);
	}

	if (attempt?.status === "IN_PROGRESS") {
		return (
			<Button
				type="button"
				size="sm"
				onClick={() => router.push(ROUTES.CANDIDATE_ATTEMPT(attempt.id))}
			>
				<RotateCcw className="size-4" />
				Resume assessment
			</Button>
		);
	}

	if (
		attempt?.status === "SUBMITTED" ||
		attempt?.status === "AUTO_SUBMITTED" ||
		attempt?.status === "EXPIRED"
	) {
		return (
			<Button size="sm" variant="outline" disabled>
				Submitted
			</Button>
		);
	}

	if (invitation.status === "REVOKED") {
		return (
			<Button size="sm" variant="outline" disabled>
				Invitation revoked
			</Button>
		);
	}

	if (invitation.status === "EXPIRED") {
		return (
			<Button size="sm" variant="outline" disabled>
				Invitation expired
			</Button>
		);
	}

	return (
		<Button type="button" size="sm" disabled={starting} onClick={() => void handleStart()}>
			<Play className="size-4" />
			{starting ? "Starting..." : "Give assessment"}
		</Button>
	);
}
