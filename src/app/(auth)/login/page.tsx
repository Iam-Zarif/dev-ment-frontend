import type { Metadata } from "next";

import { DemoLogin } from "@/modules/auth/components/demo-login";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
	title: "Login",
	description: "Sign in to your Dev-ment account.",
};

export default function LoginPage() {
	return (
		<>
			<LoginForm />
			<DemoLogin />
		</>
	);
}
