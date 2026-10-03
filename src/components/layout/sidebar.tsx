"use client";

import { Code2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { DASHBOARD_NAVIGATION, ROLE_LABELS } from "@/config/navigation.config";
import { getRoleHome } from "@/config/roles.config";
import { useAuth } from "@/hooks/use-auth";

function getInitials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");
}

export function DashboardSidebar() {
	const pathname = usePathname();
	const { user } = useAuth();

	if (!user) {
		return null;
	}

	const navigation = DASHBOARD_NAVIGATION[user.role];

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							size="lg"
							tooltip="Dev-ment"
							className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
						>
							<Link href={getRoleHome(user.role)}>
								<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
									<Code2 className="size-4" />
								</span>

								<div className="min-w-0 group-data-[collapsible=icon]:hidden">
									<p className="truncate font-heading font-semibold">Dev-ment</p>

									<p className="truncate text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigation.map((item) => {
								const Icon = item.icon;

								const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
											<Link href={item.href}>
												<Icon />
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<div className="flex min-w-0 items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
					<Avatar className="size-8 shrink-0">
						<AvatarFallback>{getInitials(user.legalName)}</AvatarFallback>
					</Avatar>

					<div className="min-w-0 group-data-[collapsible=icon]:hidden">
						<p className="truncate text-sm font-medium">{user.legalName}</p>

						<p className="truncate text-xs text-muted-foreground">{user.email}</p>
					</div>
				</div>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
