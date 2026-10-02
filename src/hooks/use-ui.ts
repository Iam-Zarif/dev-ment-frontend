"use client";

import { useUI as useUIContext } from "@/contexts/ui-context";

export function useUI() {
	return useUIContext();
}