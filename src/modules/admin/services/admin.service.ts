import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { AdminAuditData, AdminDashboard, AdminUsersData } from "@/types/admin.types";
import type { ApiResponse } from "@/types/api.types";

async function getDashboard() {
	const response = await apiClient.get<ApiResponse<AdminDashboard>>(API_ENDPOINTS.admin.dashboard);

	return response.data.data;
}

async function getUsers(params: {
	page: number;
	limit: number;
	search?: string;
	role?: string;
	status?: string;
}) {
	const response = await apiClient.get<ApiResponse<AdminUsersData>>(API_ENDPOINTS.admin.users, {
		params,
	});

	return response.data.data;
}

async function updateUserStatus(id: string, status: "ACTIVE" | "BLOCKED") {
	const response = await apiClient.patch(API_ENDPOINTS.admin.userStatus(id), {
		status,
	});

	return response.data.data;
}

async function deleteUser(id: string) {
	const response = await apiClient.delete(API_ENDPOINTS.admin.user(id));

	return response.data.data;
}

async function getAuditLogs(params: { page: number; limit: number }) {
	const response = await apiClient.get<ApiResponse<AdminAuditData>>(API_ENDPOINTS.admin.auditLogs, {
		params,
	});

	return response.data.data;
}

export const adminService = {
	getDashboard,
	getUsers,
	updateUserStatus,
	deleteUser,
	getAuditLogs,
};
