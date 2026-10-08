import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type Props = {
	title: string;

	value: string | number;

	description?: string;

	icon?: LucideIcon;
};

export function StatCard({ title, value, description, icon: Icon }: Props) {
	return (
		<Card>
			<CardContent>
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-sm text-muted-foreground">{title}</p>

						<p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>

						{description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
					</div>

					{Icon && <Icon className="size-5 text-muted-foreground" />}
				</div>
			</CardContent>
		</Card>
	);
}
