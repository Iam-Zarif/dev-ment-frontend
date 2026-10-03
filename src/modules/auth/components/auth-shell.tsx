"use client";

import { Code2 } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

const authPages: Record<string, { title: string; description: string }> = {
	login: {
		title: "Welcome back",
		description: "Sign in to your account.",
	},
	register: {
		title: "Create your account",
		description: "Choose your role to get started.",
	},
	"forgot-password": {
		title: "Forgot your password?",
		description: "Enter your email to receive a reset code.",
	},
	"reset-password": {
		title: "Reset your password",
		description: "Choose a new password for your account.",
	},
	"verify-otp": {
		title: "Verify your email",
		description: "Enter your 6-digit email code.",
	},
};

export function AuthShell({ children }: { children: ReactNode }) {
	const segment = useSelectedLayoutSegment();
	const page = segment ? authPages[segment] : undefined;
	const footer =
		segment === "login" || segment === "register" ? (
			<>
				{segment === "login" ? "Don't have an account? " : "Already have an account? "}
				<Link
					href={segment === "login" ? ROUTES.REGISTER : ROUTES.LOGIN}
					className="font-medium text-primary hover:underline"
				>
					{segment === "login" ? "Create account" : "Sign in"}
				</Link>
			</>
		) : null;

	return (
		<main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
			<div className="w-full max-w-sm">
				<Link href={ROUTES.HOME} className="mx-auto mb-6 flex w-fit items-center gap-2">
					<span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<Code2 className="size-5" />
					</span>

					<span className="font-heading text-xl font-semibold">Dev-ment</span>
				</Link>

				<Card>
					{page && (
						<CardHeader className="text-center">
							<CardTitle className="text-2xl">{page.title}</CardTitle>

							<CardDescription>{page.description}</CardDescription>
						</CardHeader>
					)}

					<CardContent>
						{children}

						{footer && (
							<div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
						)}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
