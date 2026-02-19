"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { updateStoreAdapter } from "../adapters/update-store.adapter";
import type { UpdateStorePayload } from "../types";

export function useUpdateStore() {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();
	const queryClient = useQueryClient();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	return useMutation({
		mutationFn: async (payload: UpdateStorePayload) => {
			const storeId = currentStore?.id;
			if (!storeId) throw new Error("Store not found");
			return updateStoreAdapter(storeId, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["stores"] });
			if (currentStore?.id) {
				queryClient.invalidateQueries({
					queryKey: ["store-details", currentStore.id],
				});
			}
		},
	});
}
