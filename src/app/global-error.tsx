"use client";

type GlobalErrorProps = {
	error: Error & {
		digest?: string;
	};
	reset: () => void;
};

export default function GlobalError({
	reset,
}: GlobalErrorProps) {
	return (
		<html lang="en">
			<body>
				<main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-950">
					<div className="max-w-md text-center">
						<h1 className="text-3xl font-bold">
							Something went wrong
						</h1>

						<p className="mt-3 text-slate-600">
							A critical application error occurred.
						</p>

						<button
							type="button"
							onClick={reset}
							className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white"
						>
							Try again
						</button>
					</div>
				</main>
			</body>
		</html>
	);
}