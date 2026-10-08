// src/app/(dashboard)/recruiter/billing/page.tsx

import type { Metadata } from "next";

import { RecruiterBillingView } from "@/modules/payment/views/recruiter-billing-view";

export const metadata: Metadata = {
	title: "Billing & Credits",
};

export default function Page() {
	return <RecruiterBillingView />;
}
