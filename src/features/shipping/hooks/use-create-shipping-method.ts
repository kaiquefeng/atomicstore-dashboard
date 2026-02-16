"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type { CreateShippingMethodPayload, ShippingMethod } from "../types";
import { createShippingMethodAdapter } from "../adapters/create-shipping-method.adapter";

export type CreateShippingMethodData = Omit<CreateShippingMethodPayload, "storeId">;

export function useCreateShippingMethod() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<ShippingMethod, Error, CreateShippingMethodData>({
		mutationFn: async (data: CreateShippingMethodData) => {
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			const payload: CreateShippingMethodPayload = {
				...data,
				storeId: currentStore.id,
			};

			return await createShippingMethodAdapter(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
			toast.success("Método de envio criado com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao criar método de envio. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
