"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { getOrdersAdapter } from "../adapters/get-orders.adapter";

export function useOrders() {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	const {
		data: orders = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["orders", storeSlug, currentStore?.id],
		queryFn: async () => {
			const storeId = currentStore?.id;
			const orders = await getOrdersAdapter(storeId);
			return orders;
		},
		enabled: !!currentStore,
	});

	return {
		orders,
		isLoading,
		error,
	};
}
