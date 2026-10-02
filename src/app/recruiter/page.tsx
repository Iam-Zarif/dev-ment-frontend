import { Building2 } from "lucide-react";

export default function RecruiterPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<div className="max-w-lg text-center">
				<div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<Building2 className="size-6" />
				</div>

				<h1 className="mt-4 font-heading text-3xl font-semibold">Recruiter Dashboard</h1>

				<p className="mt-2 text-muted-foreground">
					Recruiter assessment management will be built here.
				</p>
			</div>
		</main>
	);
}
