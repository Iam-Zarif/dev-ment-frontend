"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

type UIContextValue = {
	sidebarCollapsed: boolean;
	mobileSidebarOpen: boolean;

	toggleSidebar: () => void;
	setSidebarCollapsed: (value: boolean) => void;

	openMobileSidebar: () => void;
	closeMobileSidebar: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

type UIProviderProps = {
	children: ReactNode;
};

export function UIProvider({ children }: UIProviderProps) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

	const toggleSidebar = useCallback(() => {
		setSidebarCollapsed((previous) => !previous);
	}, []);

	const openMobileSidebar = useCallback(() => {
		setMobileSidebarOpen(true);
	}, []);

	const closeMobileSidebar = useCallback(() => {
		setMobileSidebarOpen(false);
	}, []);

	const value = useMemo(
		() => ({
			sidebarCollapsed,
			mobileSidebarOpen,
			toggleSidebar,
			setSidebarCollapsed,
			openMobileSidebar,
			closeMobileSidebar,
		}),
		[
			sidebarCollapsed,
			mobileSidebarOpen,
			toggleSidebar,
			openMobileSidebar,
			closeMobileSidebar,
		],
	);

	return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
	const context = useContext(UIContext);

	if (!context) {
		throw new Error("useUI must be used inside UIProvider");
	}

	return context;
}