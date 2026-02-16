"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { getCustomDomainsAdapter } from "../adapters/get-custom-domains.adapter";

export function useCustomDomains() {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	const {
		data: domains = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["custom-domains", storeSlug, currentStore?.id],
		queryFn: async () => {
			const storeId = currentStore?.id;
			if (!storeId) throw new Error("Store not found");
			return await getCustomDomainsAdapter(storeId);
		},
		enabled: !!currentStore?.id,
	});

	return {
		domains,
		isLoading,
		error,
	};
}
