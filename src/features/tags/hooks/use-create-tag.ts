"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { generateSlug } from "@/helpers/generate";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import {
	type CreateTagPayload,
	type CreateTagResponse,
	createTagAdapter,
} from "../adapters/create-tag.adapter";

export interface CreateTagData {
	name: string;
	hidden?: boolean;
}

export function useCreateTag() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<CreateTagResponse, Error, CreateTagData>({
		mutationFn: async (data: CreateTagData) => {
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			const slug = generateSlug(data.name);
			const payload: CreateTagPayload = {
				name: data.name,
				slug,
				storeId: currentStore.id,
				hidden: data.hidden ?? false,
			};

			return await createTagAdapter(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tags"] });
			toast.success("Tag criada com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao criar tag. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
