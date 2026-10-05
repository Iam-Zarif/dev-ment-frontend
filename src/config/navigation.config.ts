import {
	ClipboardList,
	LayoutDashboard,
	ListChecks,
	type LucideIcon,
	SearchCheck,
} from "lucide-react";

import { ROUTES, USER_ROLES } from "@/lib/constants";
import type { UserRole } from "@/types/common.types";

export type DashboardNavItem = {
	label: string;
	href: string;
	icon: LucideIcon;
};

export const ROLE_LABELS: Record<UserRole, string> = {
	[USER_ROLES.ADMIN]: "Admin",
	[USER_ROLES.RECRUITER]: "Recruiter",
	[USER_ROLES.CANDIDATE]: "Candidate",
};

export const DASHBOARD_NAVIGATION: Record<UserRole, readonly DashboardNavItem[]> = {
	[USER_ROLES.ADMIN]: [
		{
			label: "Overview",
			href: ROUTES.ADMIN,
			icon: LayoutDashboard,
		},
	],

	[USER_ROLES.RECRUITER]: [
		{
			label: "Overview",
			href: ROUTES.RECRUITER,
			icon: LayoutDashboard,
		},
		{
			label: "Assessments",
			href: ROUTES.RECRUITER_ASSESSMENTS,
			icon: ClipboardList,
		},
		{
			label: "Question Bank",
			href: ROUTES.RECRUITER_QUESTIONS,
			icon: ListChecks,
		},
	],

	[USER_ROLES.CANDIDATE]: [
		{
			label: "Overview",
			href: ROUTES.CANDIDATE,
			icon: LayoutDashboard,
		},
		{
			label: "Assessments",
			href: ROUTES.CANDIDATE_ASSESSMENTS,
			icon: SearchCheck,
		},
	],
};
