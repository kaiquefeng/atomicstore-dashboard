import { useQuery } from "@tanstack/react-query";
import { useStoreSlug } from "@/hooks/use-store-slug";
import {
	getProductsAdapter,
	type Product,
} from "../adapters/get-products.adapter";

export const useProducts = () => {
	const store = useStoreSlug();

	const {
		data: productsData = [],
		isLoading,
		error,
	} = useQuery<Product[], Error>({
		queryKey: ["products", store],
		queryFn: async () => {
			const products = await getProductsAdapter();
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
