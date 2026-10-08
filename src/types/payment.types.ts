import type { PaginatedData } from "@/types/common.types";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export type PricingPlan = {
	id: string;
	code: string;
	name: string;

	price: number | string;
	currency: string;

	assessmentCredits: number;
	validityDays: number;
};

export type CheckoutResult = {
	paymentId: string;
	status: "PENDING";

	plan: PricingPlan;

	checkoutSessionId: string;
	checkoutUrl: string;
};

export type PaymentItem = {
	id: string;

	amount: number | string;
	currency: string;
	status: PaymentStatus;

	paidAt: string | null;
	failedAt: string | null;
	cancelledAt: string | null;
	refundedAt: string | null;

	createdAt: string;

	plan: {
		code: string;
		name: string;

		assessmentCredits: number | null;
		validityDays: number | null;
	};

	creditGrant: {
		id: string;
		totalCredits: number;
		remainingCredits: number;
		expiresAt: string | null;
	} | null;
};

export type PaymentListData = PaginatedData<PaymentItem>;

export type CreditBalance = {
	availableCredits: number;
	freeCredits: number;
	purchasedCredits: number;

	grants: Array<{
		id: string;
		source: string;

		totalCredits: number;
		remainingCredits: number;

		expiresAt: string | null;
		createdAt: string;

		isExpired: boolean;
		isUsable: boolean;

		plan: {
			code: string;
			name: string;
		} | null;
	}>;
};
