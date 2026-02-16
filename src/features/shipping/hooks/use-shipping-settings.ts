"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { getShippingSettingsAdapter } from "../adapters/get-shipping-settings.adapter";

export function useShippingSettings() {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	const {
		data: shippingSettings,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["shipping-settings", storeSlug, currentStore?.id],
		queryFn: async () => {
			const storeId = currentStore?.id;
			const settings = await getShippingSettingsAdapter(storeId);
			return settings;
		},
		enabled: !!currentStore,
	});

	return {
		shippingSettings,
		isLoading,
		error,
	};
}
