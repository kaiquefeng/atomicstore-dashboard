import { apiClient } from "@/services/api";
import type { CreateCategoryResponse } from "./create-category.adapter";

export interface UpdateCategoryPayload {
	id: string;
	name: string;
	slug: string;
	parentId?: string | null;
	hidden?: boolean;
}

export const updateCategoryAdapter = async (
	payload: UpdateCategoryPayload,
	storeId?: string,
): Promise<CreateCategoryResponse> => {
	const { id, ...categoryData } = payload;

	// Construir payload apenas com campos necessários
	const requestPayload: Record<string, unknown> = {
		name: categoryData.name,
		slug: categoryData.slug,
	};

	// Incluir parentId apenas se não for null
	if (categoryData.parentId !== null && categoryData.parentId !== undefined) {
		requestPayload.parentId = categoryData.parentId;
	}

	// Incluir hidden se fornecido
	if (categoryData.hidden !== undefined) {
		requestPayload.hidden = categoryData.hidden;
	}

	// Construir query parameters
	const params: Record<string, string> = {};
	if (storeId) {
		params.storeId = storeId;
	}

	const response = await apiClient.put<CreateCategoryResponse>(
		`/catalog/categories/${id}`,
		requestPayload,
		{
			params,
		},
	);
	return response.data;
};
