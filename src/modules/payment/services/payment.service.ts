import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
	CheckoutResult,
	CreditBalance,
	PaymentListData,
	PaymentStatus,
	PricingPlan,
} from "@/types/payment.types";

async function getPlans() {
	const response = await apiClient.get<ApiResponse<PricingPlan[]>>(API_ENDPOINTS.payments.plans);

	return response.data.data;
}

async function checkout(planCode: string) {
	const response = await apiClient.post<ApiResponse<CheckoutResult>>(
		API_ENDPOINTS.payments.checkout,
		{
			planCode,
		},
	);

	return response.data.data;
}

async function getCredits() {
	const response = await apiClient.get<ApiResponse<CreditBalance>>(API_ENDPOINTS.payments.credits);

	return response.data.data;
}

async function getMine(params: { page: number; limit: number; status?: PaymentStatus }) {
	const response = await apiClient.get<ApiResponse<PaymentListData>>(API_ENDPOINTS.payments.root, {
		params,
	});

	return response.data.data;
}

export const paymentService = {
	getPlans,
	checkout,
	getCredits,
	getMine,
};
