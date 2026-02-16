"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { getShippingMethodsAdapter } from "../adapters/get-shipping-methods.adapter";

export function useShippingMethods() {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	const {
		data: shippingMethods = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["shipping-methods", storeSlug, currentStore?.id],
		queryFn: async () => {
			const storeId = currentStore?.id;
			const methods = await getShippingMethodsAdapter(storeId);
			return methods;
		},
		enabled: !!currentStore,
	});

	return {
		shippingMethods,
		isLoading,
		error,
	};
}
