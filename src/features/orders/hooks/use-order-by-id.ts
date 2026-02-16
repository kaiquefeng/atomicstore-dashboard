"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { getOrderByIdAdapter } from "../adapters/get-order-by-id.adapter";

export function useOrderById(orderId: string | undefined) {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	const {
		data: order,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["orders", storeSlug, currentStore?.id, orderId],
		queryFn: async () => {
			const storeId = currentStore?.id;
			const order = await getOrderByIdAdapter(orderId!, storeId);
			return order;
		},
		enabled: !!currentStore && !!orderId,
	});

	return {
		order,
		isLoading,
		error,
	};
}
