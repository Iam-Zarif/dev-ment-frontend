import { Code2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

type AuthShellProps = {
	title: string;
	description: string;
	children: ReactNode;
	footer?: ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
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
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">{title}</CardTitle>

						<CardDescription>{description}</CardDescription>
					</CardHeader>

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
