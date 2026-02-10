import { apiClient, buildStoreParams } from "@/services/api";
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

	const requestPayload: Record<string, unknown> = {
		name: categoryData.name,
		slug: categoryData.slug,
	};

	if (categoryData.parentId !== null && categoryData.parentId !== undefined) {
		requestPayload.parentId = categoryData.parentId;
	}

	if (categoryData.hidden !== undefined) {
		requestPayload.isActive = !categoryData.hidden;
	}

	const params = buildStoreParams(storeId);

	const response = await apiClient.put<CreateCategoryResponse>(
		`/catalog/categories/${id}`,
		requestPayload,
		{
			params,
		},
	);
	return response.data;
};
