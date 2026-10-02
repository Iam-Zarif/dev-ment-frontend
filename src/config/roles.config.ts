import { ROUTES, USER_ROLES } from "@/lib/constants";
import type { UserRole } from "@/types/common.types";

export const ROLE_HOME: Record<UserRole, string> = {
	[USER_ROLES.ADMIN]: ROUTES.ADMIN,

	[USER_ROLES.RECRUITER]: ROUTES.RECRUITER,

	[USER_ROLES.CANDIDATE]: ROUTES.CANDIDATE,
};

export function getRoleHome(role: UserRole) {
	return ROLE_HOME[role];
}
