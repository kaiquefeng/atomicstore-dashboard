import { apiClient } from "@/services/api";
import type { Product } from "./get-products.adapter";

export const getProductByIdAdapter = async (
	productId: string | number,
): Promise<Product> => {
	const response = await apiClient.get<Product>(
		`/catalog/products/${productId}`,
	);
	return response.data;
};
