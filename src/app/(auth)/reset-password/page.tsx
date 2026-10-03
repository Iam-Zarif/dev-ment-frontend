import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";

export const metadata: Metadata = {
	title: "Reset Password",
	description: "Set a new password for your Dev-ment account.",
};

export default async function ResetPasswordPage() {
	const session = (await cookies()).get("devment_password_reset")?.value;
	if (!session || !/^[a-f0-9]{64}$/.test(session)) redirect(ROUTES.FORGOT_PASSWORD);
	return <ResetPasswordForm />;
}
