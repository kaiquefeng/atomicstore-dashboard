"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductByIdAdapter } from "../adapters/get-product-by-id.adapter";

export function useProductById(productId: string | number | undefined) {
	return useQuery({
		queryKey: ["product", productId],
		queryFn: async () => {
			if (!productId) {
				throw new Error("Product ID is required");
			}
			return await getProductByIdAdapter(productId);
		},
		enabled: !!productId,
	});
}
