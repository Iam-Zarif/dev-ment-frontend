import {
	BarChart3,
	ClipboardList,
	CreditCard,
	FileText,
	LayoutDashboard,
	ListChecks,
	type LucideIcon,
	SearchCheck,
	Settings,
	ShieldCheck,
	Users,
	UsersRound,
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
		{
			label: "Users",
			href: ROUTES.ADMIN_USERS,
			icon: Users,
		},
		{
			label: "Reports",
			href: ROUTES.ADMIN_REPORTS,
			icon: BarChart3,
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
		{
			label: "Applications",
			href: ROUTES.RECRUITER_APPLICATIONS,
			icon: UsersRound,
		},
		{
			label: "Evaluations",
			href: ROUTES.RECRUITER_EVALUATIONS,
			icon: ShieldCheck,
		},
		{
			label: "Billing",
			href: ROUTES.RECRUITER_BILLING,
			icon: CreditCard,
		},
		{
			label: "Profile",
			href: ROUTES.RECRUITER_PROFILE,
			icon: Settings,
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
		{
			label: "My Applications",
			href: ROUTES.CANDIDATE_APPLICATIONS,
			icon: FileText,
		},
		{
			label: "Profile",
			href: ROUTES.CANDIDATE_PROFILE,
			icon: Settings,
		},
	],
};
