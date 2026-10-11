import type { Metadata } from "next";

import { PaymentSuccessView } from "@/modules/payment/views/payment-success-view";

export const metadata: Metadata = {
	title: "Payment confirmation",
	description: "Verify your checkout and return to billing.",
};

type PaymentSuccessPageProps = {
	searchParams: Promise<{ session_id?: string | string[] }>;
};

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
	const params = await searchParams;
	const sessionId = typeof params.session_id === "string" ? params.session_id : null;

	return <PaymentSuccessView sessionId={sessionId} />;
}
