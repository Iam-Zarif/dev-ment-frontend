import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
	AcceptedInvitation,
	CandidateInvitation,
	InvitationCreated,
} from "@/types/invitation.types";

async function create(applicationId: string) {
	const response = await apiClient.post<ApiResponse<InvitationCreated>>(
		API_ENDPOINTS.invitations.root,
		{
			applicationId,
		},
	);

	return response.data.data;
}

async function verify(token: string) {
	const response = await apiClient.post<ApiResponse<CandidateInvitation>>(
		API_ENDPOINTS.invitations.verify,
		{
			token,
		},
	);

	return response.data.data;
}

async function accept(token: string) {
	const response = await apiClient.post<ApiResponse<AcceptedInvitation>>(
		API_ENDPOINTS.invitations.accept,
		{
			token,
		},
	);

	return response.data.data;
}

export const invitationService = {
	create,
	verify,
	accept,
};
