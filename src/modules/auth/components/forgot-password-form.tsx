"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/constants";
import {
	type ForgotPasswordFormValues,
	forgotPasswordSchema,
} from "@/modules/auth/schemas/auth.schema";
import { authService } from "@/modules/auth/services/auth.service";
import { getOtpVerificationUrl } from "@/modules/auth/utils/otp-url";
import { formatError } from "@/utils/format-error";

export function ForgotPasswordForm() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (values: ForgotPasswordFormValues) => {
		try {
			const response = await authService.forgotPassword(values);

			router.push(getOtpVerificationUrl(response.data, "PASSWORD_RESET"));

			toast.success("Verification code sent");
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

			<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Sending...
					</>
				) : (
					<>
						<Send className="size-4" />
						Send verification code
					</>
				)}
			</Button>

			<div className="text-center">
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
