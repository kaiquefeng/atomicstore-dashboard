import { apiClient, buildStoreParams } from "@/services/api";

export interface Product {
	id: string | number;
	name?: string;
	title?: string;
	slug?: string;
	image?: string;
	images?: string[];
	type?: string;
	category?: string;
	categoryId?: string;
	categoryIds?: string[];
	categories?: Array<{ id: string; name?: string }>;
	tagIds?: string[];
	tags?: Array<{ id: string; name?: string } | string>;
	status?: string;
	[key: string]: unknown;
}

export const getProductsAdapter = async (
	storeId?: string,
): Promise<Product[]> => {
	const params = buildStoreParams(storeId);
	const response = await apiClient.get<
		| Product[]
		| {
				products?: Product[];
				data?: Product[];
				items?: Product[];
		  }
	>("/catalog/all", { params });

	const data = response.data;
	const productsList = Array.isArray(data)
		? data
		: data.products || data.data || data.items || [];

	return productsList;
};
