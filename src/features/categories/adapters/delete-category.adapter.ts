import { apiClient, buildStoreParams } from "@/services/api";

export interface DeleteCategoryResponse {
	id: string;
	success?: boolean;
	[key: string]: unknown;
}

export const deleteCategoryAdapter = async (
	categoryId: string,
	storeId?: string,
): Promise<DeleteCategoryResponse> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.delete<DeleteCategoryResponse>(
		`/catalog/categories/${categoryId}`,
		{
			params,
		},
	);
	return response.data;
};
