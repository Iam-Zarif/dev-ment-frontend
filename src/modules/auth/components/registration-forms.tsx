"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseBusiness, Eye, EyeOff, Loader2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type CandidateRegistrationFormValues,
	candidateRegistrationSchema,
	type RecruiterRegistrationFormValues,
	recruiterRegistrationSchema,
} from "@/modules/auth/schemas/auth.schema";
import { authService } from "@/modules/auth/services/auth.service";
import { getOtpVerificationUrl } from "@/modules/auth/utils/otp-url";
import { formatError } from "@/utils/format-error";

type PasswordFieldProps = {
	id: string;
	label: string;
	placeholder: string;
	registration: UseFormRegisterReturn;
	error?: string;
	disabled?: boolean;
};

function PasswordField({
	id,
	label,
	placeholder,
	registration,
	error,
	disabled = false,
}: PasswordFieldProps) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>

			<div className="relative">
				<Input
					id={id}
					type={visible ? "text" : "password"}
					placeholder={placeholder}
					autoComplete="new-password"
					className="pr-10"
					aria-invalid={Boolean(error)}
					disabled={disabled}
					{...registration}
				/>

				<button
					type="button"
					onClick={() => setVisible((current) => !current)}
					disabled={disabled}
					className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
					aria-label={visible ? "Hide password" : "Show password"}
				>
					{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
				</button>
			</div>

			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
}

function CandidateRegistrationForm() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CandidateRegistrationFormValues>({
		resolver: zodResolver(candidateRegistrationSchema),

		defaultValues: {
			legalName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: CandidateRegistrationFormValues) => {
		try {
			const response = await authService.registerCandidate(values);

			toast.success(response.message);

			router.push(getOtpVerificationUrl(response.data, "CANDIDATE_REGISTRATION"));
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
			<div className="space-y-2">
				<Label htmlFor="candidate-name">Legal name</Label>

				<Input
					id="candidate-name"
					placeholder="Your full name"
					autoComplete="name"
					aria-invalid={Boolean(errors.legalName)}
					disabled={isSubmitting}
					{...register("legalName")}
				/>

				{errors.legalName && <p className="text-sm text-destructive">{errors.legalName.message}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="candidate-email">Email address</Label>

				<Input
					id="candidate-email"
					type="email"
					placeholder="you@example.com"
					autoComplete="email"
					aria-invalid={Boolean(errors.email)}
					disabled={isSubmitting}
					{...register("email")}
				/>

				{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
			</div>

			<PasswordField
				id="candidate-password"
				label="Password"
				placeholder="Create a password"
				registration={register("password")}
				error={errors.password?.message}
				disabled={isSubmitting}
			/>

			<PasswordField
				id="candidate-confirm-password"
				label="Confirm password"
				placeholder="Repeat your password"
				registration={register("confirmPassword")}
				error={errors.confirmPassword?.message}
				disabled={isSubmitting}
			/>

			<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Sending OTP...
					</>
				) : (
					<>
						<UserRound className="size-4" />
						Create candidate account
					</>
				)}
			</Button>
		</form>
	);
}

function RecruiterRegistrationForm() {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RecruiterRegistrationFormValues>({
		resolver: zodResolver(recruiterRegistrationSchema),

		defaultValues: {
			legalName: "",
			email: "",
			companyName: "",
			jobTitle: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: RecruiterRegistrationFormValues) => {
		try {
			const response = await authService.registerRecruiter(values);

			toast.success(response.message);

			router.push(getOtpVerificationUrl(response.data, "RECRUITER_REGISTRATION"));
		} catch (error) {
			toast.error(formatError(error));
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
			<div className="space-y-2">
				<Label htmlFor="recruiter-name">Legal name</Label>

				<Input
					id="recruiter-name"
					placeholder="Your full name"
					autoComplete="name"
					aria-invalid={Boolean(errors.legalName)}
					disabled={isSubmitting}
					{...register("legalName")}
				/>

				{errors.legalName && <p className="text-sm text-destructive">{errors.legalName.message}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="recruiter-email">Company email</Label>

				<Input
					id="recruiter-email"
					type="email"
					placeholder="you@company.com"
					autoComplete="email"
					aria-invalid={Boolean(errors.email)}
					disabled={isSubmitting}
					{...register("email")}
				/>

				<p className="text-xs text-muted-foreground">
					Use your company email address. Personal email providers are not accepted.
				</p>

				{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="company-name">Company name</Label>

				<Input
					id="company-name"
					placeholder="Acme Inc."
					autoComplete="organization"
					aria-invalid={Boolean(errors.companyName)}
					disabled={isSubmitting}
					{...register("companyName")}
				/>

				{errors.companyName && (
					<p className="text-sm text-destructive">{errors.companyName.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="job-title">
					Job title <span className="font-normal text-muted-foreground">(optional)</span>
				</Label>

				<Input
					id="job-title"
					placeholder="Technical Recruiter"
					autoComplete="organization-title"
					aria-invalid={Boolean(errors.jobTitle)}
					disabled={isSubmitting}
					{...register("jobTitle")}
				/>

				{errors.jobTitle && <p className="text-sm text-destructive">{errors.jobTitle.message}</p>}
			</div>

			<PasswordField
				id="recruiter-password"
				label="Password"
				placeholder="Create a password"
				registration={register("password")}
				error={errors.password?.message}
				disabled={isSubmitting}
			/>

			<PasswordField
				id="recruiter-confirm-password"
				label="Confirm password"
				placeholder="Repeat your password"
				registration={register("confirmPassword")}
				error={errors.confirmPassword?.message}
				disabled={isSubmitting}
			/>

			<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Sending OTP...
					</>
				) : (
					<>
						<BriefcaseBusiness className="size-4" />
						Create recruiter account
					</>
				)}
			</Button>
		</form>
	);
}

export function RegistrationForms() {
	return (
		<Tabs defaultValue="candidate" className="w-full">
			<TabsList className="mb-5 grid w-full grid-cols-2">
				<TabsTrigger value="candidate">Candidate</TabsTrigger>

				<TabsTrigger value="recruiter">Recruiter</TabsTrigger>
			</TabsList>

			<TabsContent value="candidate">
				<CandidateRegistrationForm />
			</TabsContent>

			<TabsContent value="recruiter">
				<RecruiterRegistrationForm />
			</TabsContent>
		</Tabs>
	);
}
