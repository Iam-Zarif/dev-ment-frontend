"use client";

import { Building2, Code2, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { USER_ROLES } from "@/lib/constants";
import type { UserRole } from "@/types/common.types";
import { formatError } from "@/utils/format-error";

type DemoAccount = {
	role: UserRole;
	label: string;
	email: string;
	password: string;
};

const DEMO_ACCOUNTS: DemoAccount[] = [
	{
		role: USER_ROLES.ADMIN,
		label: "Admin",
		email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "",
		password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
	},
	{
		role: USER_ROLES.RECRUITER,
		label: "Recruiter",
		email: process.env.NEXT_PUBLIC_DEMO_RECRUITER_EMAIL ?? "",
		password: process.env.NEXT_PUBLIC_DEMO_RECRUITER_PASSWORD ?? "",
	},
	{
		role: USER_ROLES.CANDIDATE,
		label: "Candidate",
		email: process.env.NEXT_PUBLIC_DEMO_CANDIDATE_EMAIL ?? "",
		password: process.env.NEXT_PUBLIC_DEMO_CANDIDATE_PASSWORD ?? "",
	},
];

function DemoRoleIcon({ role }: { role: UserRole }) {
	if (role === USER_ROLES.ADMIN) {
		return <ShieldCheck className="size-4" />;
	}

	if (role === USER_ROLES.RECRUITER) {
		return <Building2 className="size-4" />;
	}

	return <Code2 className="size-4" />;
}

export function DemoLogin() {
	const router = useRouter();
	const { login } = useAuth();

	const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

	const handleDemoLogin = async (account: DemoAccount) => {
		if (!account.email || !account.password) {
			toast.error(`${account.label} demo credentials are not configured.`);

			return;
		}

		setLoadingRole(account.role);

		try {
			const response = await login({
				email: account.email,
				password: account.password,
			});

			toast.success(`${account.label} demo login successful`);

			router.replace(response.redirectTo);
			router.refresh();
		} catch (error) {
			toast.error(formatError(error));
		} finally {
			setLoadingRole(null);
		}
	};

	return (
		<div>
			<div className="relative my-5">
				<Separator />

				<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
					Demo login
				</span>
			</div>

			<div className="grid grid-cols-3 gap-2">
				{DEMO_ACCOUNTS.map((account) => (
					<Button
						key={account.role}
						type="button"
						variant="outline"
						className="h-auto flex-col gap-1.5 py-3"
						disabled={loadingRole !== null}
						onClick={() => void handleDemoLogin(account)}
					>
						{loadingRole === account.role ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<DemoRoleIcon role={account.role} />
						)}

						<span className="text-xs">{account.label}</span>
					</Button>
				))}
			</div>
		</div>
	);
}
