"use client";

import { Send, UserCheck, UserX } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Button } from "@/components/ui/button";
import { RejectApplicationDialog } from "@/modules/application/components/reject-application-dialog";
import type { ApplicationStatus } from "@/types/application.types";

type Props = {
	status: ApplicationStatus;

	shortlisting: boolean;
	rejecting: boolean;
	inviting: boolean;

	onShortlist: () => Promise<void>;

	onReject: (reason?: string) => Promise<void>;

	onInvite: () => Promise<void>;
};

export function RecruiterApplicationActions({
	status,
	shortlisting,
	rejecting,
	inviting,
	onShortlist,
	onReject,
	onInvite,
}: Props) {
	const [shortlistOpen, setShortlistOpen] = useState(false);

	const [rejectOpen, setRejectOpen] = useState(false);

	const [inviteOpen, setInviteOpen] = useState(false);

	if (status === "REJECTED" || status === "INVITED") {
		return null;
	}

	return (
		<>
			<div className="flex flex-wrap gap-2">
				{status === "APPLIED" && (
					<Button type="button" onClick={() => setShortlistOpen(true)}>
						<UserCheck className="size-4" />
						Shortlist
					</Button>
				)}

				{status === "SHORTLISTED" && (
					<Button type="button" onClick={() => setInviteOpen(true)}>
						<Send className="size-4" />
						Send invitation
					</Button>
				)}

				<Button type="button" variant="outline" onClick={() => setRejectOpen(true)}>
					<UserX className="size-4" />
					Reject
				</Button>
			</div>

			<ConfirmDialog
				open={shortlistOpen}
				onOpenChange={setShortlistOpen}
				title="Shortlist candidate?"
				description="The candidate will become eligible for an assessment invitation."
				confirmLabel="Shortlist"
				loading={shortlisting}
				onConfirm={onShortlist}
			/>

			<ConfirmDialog
				open={inviteOpen}
				onOpenChange={setInviteOpen}
				title="Send assessment invitation?"
				description="An invitation will be created and queued for email delivery."
				confirmLabel="Send invitation"
				loading={inviting}
				onConfirm={onInvite}
			/>

			<RejectApplicationDialog
				open={rejectOpen}
				loading={rejecting}
				onOpenChange={setRejectOpen}
				onReject={onReject}
			/>
		</>
	);
}
