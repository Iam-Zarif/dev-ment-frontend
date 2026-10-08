"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
	type CandidateProfileValues,
	candidateProfileSchema,
} from "@/modules/profile/schemas/profile.schema";
import { profileService } from "@/modules/profile/services/profile.service";
import { formatError } from "@/utils/format-error";

function optional(value: string) {
	return value.trim() || null;
}

export function CandidateForm({
	user,
	onUpdated,
}: {
	user: Awaited<ReturnType<typeof profileService.getMe>>;
	onUpdated: () => Promise<void>;
}) {
	const profile = user.candidateProfile;

	const form = useForm<CandidateProfileValues>({
		resolver: zodResolver(candidateProfileSchema),

		defaultValues: {
			legalName: user.legalName,

			phone: profile?.phone ?? "",

			headline: profile?.headline ?? "",

			bio: profile?.bio ?? "",

			experienceYears: Number(profile?.experienceYears ?? 0),

			skills: profile?.skills.join(", ") ?? "",

			githubUrl: profile?.githubUrl ?? "",

			linkedinUrl: profile?.linkedinUrl ?? "",

			portfolioUrl: profile?.portfolioUrl ?? "",
		},
	});

	const mutation = useMutation({
		mutationFn: (values: CandidateProfileValues) =>
			profileService.updateCandidate({
				legalName: values.legalName,

				phone: optional(values.phone),

				headline: optional(values.headline),

				bio: optional(values.bio),

				experienceYears: values.experienceYears,

				skills: values.skills
					.split(",")
					.map((item) => item.trim())
					.filter(Boolean),

				githubUrl: optional(values.githubUrl),

				linkedinUrl: optional(values.linkedinUrl),

				portfolioUrl: optional(values.portfolioUrl),
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
						<Label>Phone</Label>

						<Input {...form.register("phone")} />
					</div>

					<div className="space-y-2 sm:col-span-2">
						<Label>Headline</Label>

						<Input {...form.register("headline")} />
					</div>

					<div className="space-y-2 sm:col-span-2">
						<Label>Bio</Label>

						<Textarea rows={5} {...form.register("bio")} />
					</div>

					<div className="space-y-2">
						<Label>Experience years</Label>

						<Input type="number" step="0.1" {...form.register("experienceYears")} />
					</div>

					<div className="space-y-2">
						<Label>Skills</Label>

						<Input placeholder="React, Node.js, PostgreSQL" {...form.register("skills")} />
					</div>

					<Input placeholder="GitHub URL" {...form.register("githubUrl")} />

					<Input placeholder="LinkedIn URL" {...form.register("linkedinUrl")} />

					<Input
						placeholder="Portfolio URL"
						className="sm:col-span-2"
						{...form.register("portfolioUrl")}
					/>

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
