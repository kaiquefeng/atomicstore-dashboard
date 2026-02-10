"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { generateSlug } from "@/helpers/generate";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type { CreateCategoryResponse } from "../adapters/create-category.adapter";
import {
	type UpdateCategoryPayload,
	updateCategoryAdapter,
} from "../adapters/update-category.adapter";

export interface UpdateCategoryData {
	id: string;
	name: string;
	parentId?: string | null;
	hidden?: boolean;
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<CreateCategoryResponse, Error, UpdateCategoryData>({
		mutationFn: async (data: UpdateCategoryData) => {
			// 1. Obter storeId a partir do slug
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			// 2. Montar payload da categoria
			const slug = generateSlug(data.name);
			const payload: UpdateCategoryPayload = {
				id: data.id,
				name: data.name,
				slug,
			};

			// 3. Incluir parentId apenas se não for null
			if (data.parentId !== null && data.parentId !== undefined) {
				payload.parentId = data.parentId;
			}

			// 4. Incluir hidden se fornecido
			if (data.hidden !== undefined) {
				payload.hidden = data.hidden;
			}

			// 5. Atualizar a categoria
			return await updateCategoryAdapter(payload, currentStore.id);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["category", data.id] });
			toast.success("Categoria atualizada com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao atualizar categoria. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
