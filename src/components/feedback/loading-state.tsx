import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
	label?: string;
	className?: string;
};

export function LoadingState({ label = "Loading...", className }: LoadingStateProps) {
	return (
		<div className={cn("flex min-h-48 items-center justify-center", className)}>
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Spinner className="size-4" />
				<span>{label}</span>
			</div>
		</div>
	);
}
