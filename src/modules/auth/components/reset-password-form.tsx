"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import {
	type ResetPasswordFormValues,
	resetPasswordSchema,
} from "@/modules/auth/schemas/auth.schema";
import { authService } from "@/modules/auth/services/auth.service";
import { formatError } from "@/utils/format-error";

export function ResetPasswordForm() {
	const [showPassword, setShowPassword] = useState(false);

	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [isSuccess, setIsSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),

		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: ResetPasswordFormValues) => {
		try {
			const response = await authService.resetPassword(values);

			setIsSuccess(true);

			toast.success(response.message || "Password reset successfully");
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	if (isSuccess) {
		return (
			<div className="space-y-5 text-center">
				<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
					<ShieldCheck className="size-6" />
				</div>

				<div className="space-y-2">
					<h2 className="font-heading text-lg font-semibold">Password updated</h2>

					<p className="text-sm leading-6 text-muted-foreground">Sign in with your new password.</p>
				</div>

				<Button asChild className="w-full" size="lg">
					<Link href={ROUTES.LOGIN}>Sign in</Link>
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
			{(["password", "confirmPassword"] as const).map((field) => {
				const isPassword = field === "password";
				const visible = isPassword ? showPassword : showConfirmPassword;
				const toggle = isPassword ? setShowPassword : setShowConfirmPassword;
				return (
					<div key={field} className="space-y-2">
						<Label htmlFor={field}>{isPassword ? "New password" : "Confirm new password"}</Label>
						<div className="relative">
							<Input
								id={field}
								type={visible ? "text" : "password"}
								autoComplete="new-password"
								className="pr-10"
								aria-invalid={Boolean(errors[field])}
								disabled={isSubmitting}
								{...register(field)}
							/>
							<button
								type="button"
								onClick={() => toggle((current) => !current)}
								className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-foreground"
								aria-label={`${visible ? "Hide" : "Show"} ${isPassword ? "password" : "confirm password"}`}
								disabled={isSubmitting}
							>
								{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
							</button>
						</div>
						{errors[field] && <p className="text-sm text-destructive">{errors[field]?.message}</p>}
					</div>
				);
			})}

			<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Resetting...
					</>
				) : (
					<>
						<KeyRound className="size-4" />
						Reset password
					</>
				)}
			</Button>

			<div className="space-y-2 text-center">
				<Link
					href={ROUTES.FORGOT_PASSWORD}
					className="block text-sm text-muted-foreground hover:text-foreground"
				>
					Request a new verification code
				</Link>
				<Link
					href={ROUTES.LOGIN}
					className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
				>
					<ArrowLeft className="size-4" />
					Back to login
				</Link>
			</div>
		</form>
	);
}
