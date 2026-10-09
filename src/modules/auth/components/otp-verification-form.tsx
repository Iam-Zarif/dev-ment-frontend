"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import { type VerifyOtpFormValues, verifyOtpSchema } from "@/modules/auth/schemas/auth.schema";
import { authService } from "@/modules/auth/services/auth.service";
import type { OtpPurpose } from "@/types/auth.types";
import { formatError } from "@/utils/format-error";

type OtpVerificationFormProps = {
	email: string;
	purpose: OtpPurpose;
	expiresInSeconds?: number;
	expiresAt?: number;
};

export function OtpVerificationForm({
	email,
	purpose,
	expiresInSeconds = 300,
	expiresAt,
}: OtpVerificationFormProps) {
	const router = useRouter();
	const [deadline, setDeadline] = useState(() => expiresAt ?? Date.now() + expiresInSeconds * 1000);
	const [remainingSeconds, setRemainingSeconds] = useState(() =>
		Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
	);
	useEffect(() => {
		const update = () =>
			setRemainingSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
		update();
		const interval = window.setInterval(update, 1000);
		return () => window.clearInterval(interval);
	}, [deadline]);
	const countdown = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;

	const { verifyOtp } = useAuth();
	const isPasswordReset = purpose === "PASSWORD_RESET";

	const [isResending, setIsResending] = useState(false);

	const {
		register,
		handleSubmit,
		resetField,
		setValue,
		control,
		formState: { errors, isSubmitting },
	} = useForm<VerifyOtpFormValues>({
		resolver: zodResolver(verifyOtpSchema),

		defaultValues: {
			email,
			otp: "",
			purpose,
		},
	});

	const otp = useWatch({ control, name: "otp" });

	const onSubmit = async (values: VerifyOtpFormValues) => {
		try {
			if (values.purpose === "PASSWORD_RESET") {
				await authService.verifyPasswordResetOtp({ email: values.email, otp: values.otp });
				toast.success("Email verified. Set your new password.");
				router.replace(ROUTES.RESET_PASSWORD);
				return;
			}
			const response = await verifyOtp({ ...values, purpose: values.purpose });

			toast.success(response.message || "Account verified successfully");

			router.replace(response.redirectTo);
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	const handleResend = async () => {
		setIsResending(true);

		try {
			const response =
				purpose === "PASSWORD_RESET"
					? await authService.forgotPassword({ email })
					: await authService.resendOtp({ email, purpose });

			resetField("otp");
			const nextDeadline = Date.now() + response.data.expiresInSeconds * 1000;
			setDeadline(nextDeadline);
			const params = new URLSearchParams({
				email,
				purpose,
				expires: String(response.data.expiresInSeconds),
				expiresAt: String(nextDeadline),
			});
			router.replace(`${ROUTES.VERIFY_OTP}?${params}`, { scroll: false });

			toast.success(response.message || "Verification code resent");
		} catch (error) {
			toast.error(formatError(error));
		} finally {
			setIsResending(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
			<div className="text-center">
				<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
					<MailCheck className="size-6" />
				</div>

				<p className="text-sm font-medium">{email}</p>
				<p
					className={`mt-2 font-mono text-sm tabular-nums ${remainingSeconds === 0 ? "text-destructive" : "text-muted-foreground"}`}
					role="timer"
					aria-label={remainingSeconds === 0 ? "Code expired" : "Code expires in"}
				>
					{countdown}
				</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="otp">Verification code</Label>

				<Input
					id="otp"
					type="text"
					inputMode="numeric"
					autoComplete="one-time-code"
					placeholder="000000"
					maxLength={6}
					pattern="[0-9]{6}"
					aria-describedby={errors.otp ? "otp-error" : undefined}
					className="h-12 text-center font-mono text-xl tracking-[0.45em]"
					aria-invalid={Boolean(errors.otp)}
					disabled={isSubmitting || isResending}
					{...register("otp", {
						onChange: (event) => {
							const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
							event.target.value = digits;
							setValue("otp", digits, { shouldValidate: Boolean(errors.otp) });
						},
					})}
				/>

				{errors.otp && (
					<p id="otp-error" role="alert" className="text-sm text-destructive">
						{errors.otp.message}
					</p>
				)}
			</div>

			<Button
				type="submit"
				size="lg"
				className="w-full"
				disabled={isSubmitting || isResending || otp.length !== 6 || remainingSeconds === 0}
			>
				{isSubmitting ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Verifying...
					</>
				) : (
					<>
						<ShieldCheck className="size-4" />
						{isPasswordReset ? "Verify code" : "Verify account"}
					</>
				)}
			</Button>

			<Button
				type="button"
				variant="ghost"
				className="w-full"
				disabled={isSubmitting || isResending}
				onClick={() => void handleResend()}
			>
				{isResending ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Sending...
					</>
				) : (
					<>
						<RefreshCcw className="size-4" />
						Resend code
					</>
				)}
			</Button>
		</form>
	);
}
