import { ROUTES } from "@/lib/constants";
import type { OtpPurpose, RegistrationResult } from "@/types/auth.types";

export function getOtpVerificationUrl(
	data: Pick<RegistrationResult, "email" | "expiresInSeconds">,
	purpose: OtpPurpose,
) {
	const params = new URLSearchParams({
		email: data.email,
		purpose,
		expires: String(data.expiresInSeconds),
		expiresAt: String(Date.now() + data.expiresInSeconds * 1000),
	});
	return `${ROUTES.VERIFY_OTP}?${params}`;
}
