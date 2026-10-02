import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<div className="max-w-lg text-center">
				<p className="text-sm font-semibold text-primary">404 ERROR</p>

				<h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>

				<p className="mt-4 text-muted-foreground">
					The page you are looking for does not exist or may have been moved.
				</p>

				<div className="mt-7 flex flex-wrap justify-center gap-3">
					<Link
						href="/"
						className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
					>
						<Home className="size-4" />
						Home
					</Link>

					<Link
						href="/login"
						className="inline-flex h-10 items-center gap-2 rounded-lg border bg-card px-4 text-sm font-medium"
					>
						<ArrowLeft className="size-4" />
						Login
					</Link>
				</div>
			</div>
		</main>
	);
}
