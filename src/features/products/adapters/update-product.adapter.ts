import { apiClient } from "@/services/api";
import type {
	CreateProductPayload,
	CreateProductResponse,
} from "./create-product.adapter";

export interface UpdateProductPayload extends CreateProductPayload {
	id: string | number;
}

export const updateProductAdapter = async (
	payload: UpdateProductPayload,
): Promise<CreateProductResponse> => {
	const { id, ...productData } = payload;
	const response = await apiClient.put<CreateProductResponse>(
		`/catalog/products/${id}`,
		{
			metadata: {
				properties: productData.properties,
			},
			...productData,
		},
	);
	return response.data;
};
