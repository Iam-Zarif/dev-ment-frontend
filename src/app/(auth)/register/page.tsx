import type { Metadata } from "next";

import { RegistrationForms } from "@/modules/auth/components/registration-forms";

export const metadata: Metadata = {
	title: "Create Account",
	description: "Create a candidate or recruiter account on Dev-ment.",
};

export default function RegisterPage() {
	return <RegistrationForms />;
}
