"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import { type LoginFormValues, loginSchema } from "@/modules/auth/schemas/auth.schema";
import { formatError } from "@/utils/format-error";

function getSafeNextPath(nextPath: string | null, roleHome: string) {
	if (!nextPath?.startsWith("/") || nextPath.startsWith("//")) {
		return roleHome;
	}

	const isRoleRoute = nextPath === roleHome || nextPath.startsWith(`${roleHome}/`);

	const isCandidateInvitation =
		roleHome === ROUTES.CANDIDATE &&
		(nextPath === ROUTES.INVITATIONS || nextPath.startsWith(`${ROUTES.INVITATIONS}?`));

	if (!isRoleRoute && !isCandidateInvitation) {
		return roleHome;
	}

	return nextPath;
}

export function LoginForm() {
	const router = useRouter();
	const { login } = useAuth();

	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),

		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: LoginFormValues) => {
		try {
			const response = await login(values);

			toast.success(response.message || "Login successful");

			const nextPath = getSafeNextPath(
				new URLSearchParams(window.location.search).get("next"),
				response.redirectTo,
			);

			router.replace(nextPath);
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
			<div className="space-y-2">
				<Label htmlFor="email">Email address</Label>

				<Input
					id="email"
					type="email"
					placeholder="you@example.com"
					autoComplete="email"
					aria-invalid={Boolean(errors.email)}
					disabled={isSubmitting}
					{...register("email")}
				/>

				{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between gap-4">
					<Label htmlFor="password">Password</Label>

					<Link
						href={ROUTES.FORGOT_PASSWORD}
						className="text-sm font-medium text-primary hover:underline"
					>
						Forgot password?
					</Link>
				</div>

				<div className="relative">
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="Enter your password"
						autoComplete="current-password"
						className="pr-10"
						aria-invalid={Boolean(errors.password)}
						disabled={isSubmitting}
						{...register("password")}
					/>

					<button
						type="button"
						onClick={() => setShowPassword((current) => !current)}
						disabled={isSubmitting}
						className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
						aria-label={showPassword ? "Hide password" : "Show password"}
					>
						{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
					</button>
				</div>

				{errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
			</div>

			<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Signing in...
					</>
				) : (
					<>
						<LogIn className="size-4" />
						Sign in
					</>
				)}
			</Button>
		</form>
	);
}
