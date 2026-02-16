"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import {
	type DeleteShippingMethodResponse,
	deleteShippingMethodAdapter,
} from "../adapters/delete-shipping-method.adapter";

export function useDeleteShippingMethod() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<DeleteShippingMethodResponse, Error, string>({
		mutationFn: async (methodId: string) => {
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			return await deleteShippingMethodAdapter(methodId, currentStore.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
			toast.success("Método de envio excluído com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao excluir método de envio. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
