import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/constants";
import { OtpVerificationForm } from "@/modules/auth/components/otp-verification-form";
import type { OtpPurpose } from "@/types/auth.types";

export const metadata: Metadata = {
	title: "Verify Email",
	description: "Verify your email with a 6-digit code.",
};

type VerifyOtpPageProps = {
	searchParams: Promise<{
		email?: string;
		purpose?: string;
		expires?: string;
		expiresAt?: string;
	}>;
};

function isOtpPurpose(value: string | undefined): value is OtpPurpose {
	return (
		value === "CANDIDATE_REGISTRATION" ||
		value === "RECRUITER_REGISTRATION" ||
		value === "PASSWORD_RESET"
	);
}

export default async function VerifyOtpPage({ searchParams }: VerifyOtpPageProps) {
	const params = await searchParams;

	if (!params.email || !isOtpPurpose(params.purpose)) {
		redirect(ROUTES.REGISTER);
	}

	const parsedExpires = Number(params.expires);

	const expiresInSeconds =
		Number.isFinite(parsedExpires) && parsedExpires > 0 ? parsedExpires : undefined;

	const deadline = Number(params.expiresAt);

	return (
		<OtpVerificationForm
			key={`${params.purpose}:${params.email}`}
			email={params.email}
			purpose={params.purpose}
			expiresInSeconds={expiresInSeconds}
			expiresAt={Number.isFinite(deadline) && deadline > 0 ? deadline : undefined}
		/>
	);
}
