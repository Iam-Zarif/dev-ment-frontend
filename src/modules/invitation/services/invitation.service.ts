import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type { InvitationCreated } from "@/types/invitation.types";

async function create(applicationId: string) {
	const response = await apiClient.post<ApiResponse<InvitationCreated>>(
		API_ENDPOINTS.invitations.root,
		{
			applicationId,
		},
	);

	return response.data.data;
}

export const invitationService = {
	create,
};
