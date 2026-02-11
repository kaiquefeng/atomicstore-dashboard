"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { getProductByIdAdapter } from "../adapters/get-product-by-id.adapter";

export function useProductById(productId: string | number | undefined) {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	const currentStore = useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	return useQuery({
		queryKey: ["product", productId],
		queryFn: async () => {
			if (!productId) {
				throw new Error("Product ID is required");
			}
			const storeId = currentStore?.id;

			return await getProductByIdAdapter(productId, storeId);
		},
		enabled: !!productId,
	});
}
