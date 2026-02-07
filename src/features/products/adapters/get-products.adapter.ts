import { apiClient } from "@/services/api";

export interface Product {
	id: string | number;
	name?: string;
	title?: string;
	slug?: string;
	image?: string;
	images?: string[];
	type?: string;
	category?: string;
	status?: string;
	[key: string]: unknown;
}

export const getProductsAdapter = async (): Promise<Product[]> => {
	const response = await apiClient.get<
		| Product[]
		| {
				products?: Product[];
				data?: Product[];
				items?: Product[];
		  }
	>("/catalog/all");

	const data = response.data;
	const productsList = Array.isArray(data)
		? data
		: data.products || data.data || data.items || [];

	return productsList;
};
