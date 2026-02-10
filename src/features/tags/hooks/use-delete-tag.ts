"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type { DeleteTagResponse } from "../adapters/delete-tag.adapter";
import { deleteTagAdapter } from "../adapters/delete-tag.adapter";

export function useDeleteTag() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<DeleteTagResponse, Error, string>({
		mutationFn: async (tagId: string) => {
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			return await deleteTagAdapter(tagId, currentStore.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tags"] });
			toast.success("Tag excluída com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao excluir tag. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
