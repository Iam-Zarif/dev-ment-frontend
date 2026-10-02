import type { Metadata } from "next";
import Link from "next/link";

import { ROUTES } from "@/lib/constants";
import { AuthShell } from "@/modules/auth/components/auth-shell";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
	title: "Login",
	description: "Sign in to your Dev-ment account.",
};

export default function LoginPage() {
	return (
		<AuthShell
			title="Welcome back"
			description="Sign in to continue to your developer assessment workspace."
			footer={
				<>
					Don&apos;t have an account?{" "}
					<Link href={ROUTES.REGISTER} className="font-medium text-primary hover:underline">
						Create account
					</Link>
				</>
			}
		>
			<LoginForm />
		</AuthShell>
	);
}
