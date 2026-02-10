import { apiClient, buildStoreParams } from "@/services/api";
import type { Category } from "../types";

export interface CategoryApiResponse {
	id: string;
	name: string;
	slug: string;
	hidden?: boolean;
	parentId?: string | null;
	storeId?: string;
	[key: string]: unknown;
}

/**
 * Transforma uma lista plana de categorias em uma estrutura hierárquica
 */
function buildCategoryTree(categories: CategoryApiResponse[]): Category[] {
	// Criar um mapa de categorias por ID
	const categoryMap = new Map<string, Category>();
	const rootCategories: Category[] = [];

	// Primeiro, criar todas as categorias sem children
	for (const cat of categories) {
		categoryMap.set(cat.id, {
			id: cat.id,
			name: cat.name,
			slug: cat.slug,
			hidden: cat.hidden ?? false,
			parentId: cat.parentId ?? null,
			children: [],
		});
	}

	// Depois, organizar em hierarquia
	for (const cat of categories) {
		const category = categoryMap.get(cat.id);
		if (!category) continue;

		if (cat.parentId && categoryMap.has(cat.parentId)) {
			// É uma subcategoria
			const parent = categoryMap.get(cat.parentId);
			if (parent) {
				parent.children.push(category);
			}
		} else {
			// É uma categoria raiz
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

	// Transformar estrutura plana em árvore hierárquica
	return buildCategoryTree(categoriesList);
};
