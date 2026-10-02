export type ApiErrorDetail = {
	path?: string;
	message: string;
	code?: string;
};

export type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

export type ApiErrorResponse = {
	success: false;
	message: string;
	errors?: ApiErrorDetail[];
};
