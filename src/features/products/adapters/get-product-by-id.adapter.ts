import { apiClient, buildStoreParams } from "@/services/api";
import type { Product } from "./get-products.adapter";

export const getProductByIdAdapter = async (
	productId: string | number,
	storeId?: string,
): Promise<Product> => {
	const params = buildStoreParams(storeId);
	const response = await apiClient.get<Product>(
		`/catalog/products/${productId}`,
		{ params },
	);
	return response.data;
};
