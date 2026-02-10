import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import {
	getProductsAdapter,
	type Product,
} from "../adapters/get-products.adapter";

export const useProducts = () => {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	const currentStore = useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	const {
		data: productsData = [],
		isLoading,
		error,
	} = useQuery<Product[], Error>({
		queryKey: ["products", storeSlug, currentStore?.id],
		queryFn: async () => {
			const storeId = currentStore?.id;

			const products = await getProductsAdapter(storeId);
			return products;
		},
	});

	const products = productsData.map((product: Product, index: number) => {
		const id = product.id || `temp-${index}`;

		const image = product.image || product.images?.[0] || undefined;

		const title = product.title || product.name || `Produto ${index + 1}`;

		const slug = product.slug || title.toLowerCase().replace(/\s+/g, "-");

		const status = product.status || "draft";

		return {
			id,
			image,
			title,
			slug,
			status,
		};
	});

	return {
		products: products,
		isLoading,
		error: error
			? error instanceof Error
				? error
				: new Error("Failed to load products")
			: null,
	};
};
