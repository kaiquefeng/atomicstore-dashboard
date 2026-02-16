"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type { ShippingSettings } from "../types";
import { updateShippingSettingsAdapter } from "../adapters/update-shipping-settings.adapter";

export function useUpdateShippingSettings() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<ShippingSettings, Error, Partial<ShippingSettings>>({
		mutationFn: async (data: Partial<ShippingSettings>) => {
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			return await updateShippingSettingsAdapter(data, currentStore.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["shipping-settings"] });
			toast.success("Configurações de envio atualizadas com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao atualizar configurações de envio. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
