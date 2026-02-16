"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type { UpdateShippingMethodPayload, ShippingMethod } from "../types";
import { updateShippingMethodAdapter } from "../adapters/update-shipping-method.adapter";

export function useUpdateShippingMethod() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<ShippingMethod, Error, UpdateShippingMethodPayload>({
		mutationFn: async (data: UpdateShippingMethodPayload) => {
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			return await updateShippingMethodAdapter(data, currentStore.id);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
			queryClient.invalidateQueries({ queryKey: ["shipping-method", data.id] });
			toast.success("Método de envio atualizado com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao atualizar método de envio. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
