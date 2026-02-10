import { apiClient, buildStoreParams } from "@/services/api";
import type { Category } from "../types";

export interface CategoryApiResponse {
	id: string;
	name: string;
	slug: string;
	isActive?: boolean;
	parentId?: string | null;
	storeId?: string;
	[key: string]: unknown;
}

/**
 * Transforma uma lista plana de categorias em uma estrutura hierárquica
 */
function buildCategoryTree(categories: CategoryApiResponse[]): Category[] {
	const categoryMap = new Map<string, Category>();
	const rootCategories: Category[] = [];

	for (const cat of categories) {
		const isActive = cat.isActive ?? true;
		categoryMap.set(cat.id, {
			id: cat.id,
			name: cat.name,
			slug: cat.slug,
			isActive,
			hidden: !isActive,
			parentId: cat.parentId ?? null,
			children: [],
		});
	}

	for (const cat of categories) {
		const category = categoryMap.get(cat.id);
		if (!category) continue;

		if (cat.parentId && categoryMap.has(cat.parentId)) {
			const parent = categoryMap.get(cat.parentId);
			if (parent) {
				parent.children.push(category);
			}
		} else {
			rootCategories.push(category);
		}
	}

	return rootCategories;
}

export const getCategoriesAdapter = async (
	storeId?: string,
): Promise<Category[]> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.get<
		| CategoryApiResponse[]
		| {
				categories?: CategoryApiResponse[];
				data?: CategoryApiResponse[];
				items?: CategoryApiResponse[];
		  }
	>("/catalog/categories/all", {
		params,
	});

	const data = response.data;
	const categoriesList = Array.isArray(data)
		? data
		: data.categories || data.data || data.items || [];

	return buildCategoryTree(categoriesList);
};
