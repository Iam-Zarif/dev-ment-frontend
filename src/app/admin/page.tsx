import { ShieldCheck } from "lucide-react";

export default function AdminPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<div className="max-w-lg text-center">
				<div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<ShieldCheck className="size-6" />
				</div>

				<h1 className="mt-4 font-heading text-3xl font-semibold">Admin Dashboard</h1>

				<p className="mt-2 text-muted-foreground">
					Admin workspace is ready for the next development phase.
				</p>
			</div>
		</main>
	);
}
