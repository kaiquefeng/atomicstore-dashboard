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
	// Construir payload apenas com campos necessários
	// Não incluir parentId se for null (categoria raiz)
	const requestPayload: Record<string, unknown> = {
		name: payload.name,
		slug: payload.slug,
		storeId: payload.storeId,
	};

	// Incluir parentId apenas se não for null
	if (payload.parentId !== null && payload.parentId !== undefined) {
		requestPayload.parentId = payload.parentId;
	}

	// Incluir hidden se fornecido
	if (payload.hidden !== undefined) {
		requestPayload.hidden = payload.hidden;
	}

	const response = await apiClient.post<CreateCategoryResponse>(
		"/catalog/categories/create",
		requestPayload,
	);
	return response.data;
};
