"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import {
	updateOrderStatusAdapter,
	type UpdateOrderStatusPayload,
} from "../adapters/update-order-status.adapter";

export function useUpdateOrderStatus() {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();
	const queryClient = useQueryClient();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	return useMutation({
		mutationFn: async (payload: UpdateOrderStatusPayload) => {
			const storeId = currentStore?.id;
			return updateOrderStatusAdapter(payload, storeId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["orders", storeSlug, currentStore?.id],
			});
		},
	});
}
