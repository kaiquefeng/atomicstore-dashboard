import { apiClient } from "@/services/api";

export interface DeleteCategoryResponse {
	id: string;
	success?: boolean;
	[key: string]: unknown;
}

export const deleteCategoryAdapter = async (
	categoryId: string,
	storeId?: string,
): Promise<DeleteCategoryResponse> => {
	// Construir query parameters
	const params: Record<string, string> = {};
	if (storeId) {
		params.storeId = storeId;
	}

	const response = await apiClient.delete<DeleteCategoryResponse>(
		`/catalog/categories/${categoryId}`,
		{
			params,
		},
	);
	return response.data;
};
