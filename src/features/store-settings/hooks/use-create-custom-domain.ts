"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { createCustomDomainAdapter } from "../adapters/create-custom-domain.adapter";

interface CreateDomainParams {
	host: string;
	setAsPrimary?: boolean;
}

export function useCreateCustomDomain() {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();
	const queryClient = useQueryClient();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	return useMutation({
		mutationFn: async ({ host, setAsPrimary = false }: CreateDomainParams) => {
			const storeId = currentStore?.id;
			if (!storeId) throw new Error("Store not found");
			return createCustomDomainAdapter(storeId, { host, setAsPrimary });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["custom-domains", storeSlug, currentStore?.id],
			});
		},
	});
}
