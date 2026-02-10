"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { generateSlug } from "@/helpers/generate";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import {
	type CreateCategoryPayload,
	type CreateCategoryResponse,
	createCategoryAdapter,
} from "../adapters/create-category.adapter";

export interface CreateCategoryData {
	name: string;
	parentId: string | null;
	hidden?: boolean;
}

export function useCreateCategory() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<CreateCategoryResponse, Error, CreateCategoryData>({
		mutationFn: async (data: CreateCategoryData) => {
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
			const payload: CreateCategoryPayload = {
				name: data.name,
				slug,
				storeId: currentStore.id,
				hidden: data.hidden ?? false,
			};

			// 3. Incluir parentId apenas se não for null (subcategoria)
			if (data.parentId !== null) {
				payload.parentId = data.parentId;
			}

			// 4. Criar a categoria
			return await createCategoryAdapter(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast.success("Categoria criada com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao criar categoria. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
