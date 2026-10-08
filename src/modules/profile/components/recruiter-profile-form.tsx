"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
	type RecruiterProfileValues,
	recruiterProfileSchema,
} from "@/modules/profile/schemas/profile.schema";
import { profileService } from "@/modules/profile/services/profile.service";
import { formatError } from "@/utils/format-error";

function optional(value: string) {
	return value.trim() || null;
}

export function RecruiterForm({
	user,
	onUpdated,
}: {
	user: Awaited<ReturnType<typeof profileService.getMe>>;
	onUpdated: () => Promise<void>;
}) {
	const profile = user.recruiterProfile;

	const form = useForm<RecruiterProfileValues>({
		resolver: zodResolver(recruiterProfileSchema),

		defaultValues: {
			legalName: user.legalName,

			jobTitle: profile?.jobTitle ?? "",

			phone: profile?.phone ?? "",

			companyWebsiteUrl: profile?.company.websiteUrl ?? "",
		},
	});

	const mutation = useMutation({
		mutationFn: (values: RecruiterProfileValues) =>
			profileService.updateRecruiter({
				legalName: values.legalName,

				jobTitle: optional(values.jobTitle),

				phone: optional(values.phone),

				companyWebsiteUrl: optional(values.companyWebsiteUrl),
			}),

		onSuccess: async () => {
			await onUpdated();

			toast.success("Profile updated");
		},

		onError: (error) => toast.error(formatError(error)),
	});

	return (
		<Card>
			<CardContent>
				<form
					className="grid gap-5 sm:grid-cols-2"
					onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
				>
					<div className="space-y-2">
						<Label>Legal name</Label>

						<Input {...form.register("legalName")} />
					</div>

					<div className="space-y-2">
						<Label>Job title</Label>

						<Input {...form.register("jobTitle")} />
					</div>

					<div className="space-y-2">
						<Label>Phone</Label>

						<Input {...form.register("phone")} />
					</div>

					<div className="space-y-2">
						<Label>Company website</Label>

						<Input {...form.register("companyWebsiteUrl")} />
					</div>

					{Object.entries(form.formState.errors).map(([field, error]) => (
						<p key={field} role="alert" className="text-sm text-destructive sm:col-span-2">
							{field}: {error?.message}
						</p>
					))}

					<Button type="submit" className="sm:col-span-2" disabled={mutation.isPending}>
						Save profile
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
