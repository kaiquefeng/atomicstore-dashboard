import { apiClient } from "@/services/api";

export interface CreateCategoryPayload {
	name: string;
	slug: string;
	storeId: string;
	parentId?: string | null;
	hidden?: boolean;
}

export interface CreateCategoryResponse {
	id: string;
	name: string;
	slug: string;
	parentId?: string | null;
	hidden?: boolean;
	storeId?: string;
	[key: string]: unknown;
}

export const createCategoryAdapter = async (
	payload: CreateCategoryPayload,
): Promise<CreateCategoryResponse> => {
	const requestPayload: Record<string, unknown> = {
		name: payload.name,
		slug: payload.slug,
		storeId: payload.storeId,
	};

	if (payload.parentId !== null && payload.parentId !== undefined) {
		requestPayload.parentId = payload.parentId;
	}

	if (payload.hidden !== undefined) {
		requestPayload.isActive = !payload.hidden;
	}

	const response = await apiClient.post<CreateCategoryResponse>(
		"/catalog/categories/create",
		requestPayload,
	);
	return response.data;
};
