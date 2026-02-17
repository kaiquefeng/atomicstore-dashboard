"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { getStoreAdapter } from "../adapters/get-store.adapter";

export function useStoreDetails() {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	const {
		data: storeDetails,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["store-details", currentStore?.id],
		queryFn: async () => {
			const storeId = currentStore?.id;
			if (!storeId) throw new Error("Store not found");
			return getStoreAdapter(storeId);
		},
		enabled: !!currentStore?.id,
	});

	return {
		storeDetails: storeDetails ?? null,
		isLoading,
		error,
	};
}
