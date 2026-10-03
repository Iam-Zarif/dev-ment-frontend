import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/modules/auth/components/forgot-password-form";

export const metadata: Metadata = {
	title: "Forgot Password",
	description: "Reset your Dev-ment account password.",
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordForm />;
}
