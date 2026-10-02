export type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";

export type SortOrder = "asc" | "desc";

export type PaginationQuery = {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: SortOrder;
};

export type PaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type PaginatedData<T> = {
	items: T[];
	meta: PaginationMeta;
};

export type SelectOption = {
	label: string;
	value: string;
};
