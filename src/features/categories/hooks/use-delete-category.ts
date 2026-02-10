"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type { DeleteCategoryResponse } from "../adapters/delete-category.adapter";
import { deleteCategoryAdapter } from "../adapters/delete-category.adapter";

export function useDeleteCategory() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<DeleteCategoryResponse, Error, string>({
		mutationFn: async (categoryId: string) => {
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			// 2. Excluir a categoria
			return await deleteCategoryAdapter(categoryId, currentStore.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast.success("Categoria excluída com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao excluir categoria. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
