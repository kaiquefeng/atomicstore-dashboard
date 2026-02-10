"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { generateSlug } from "@/helpers/generate";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type { CreateTagResponse } from "../adapters/create-tag.adapter";
import {
	type UpdateTagPayload,
	updateTagAdapter,
} from "../adapters/update-tag.adapter";

export interface UpdateTagData {
	id: string;
	name: string;
	hidden?: boolean;
}

export function useUpdateTag() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	return useMutation<CreateTagResponse, Error, UpdateTagData>({
		mutationFn: async (data: UpdateTagData) => {
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			const slug = generateSlug(data.name);
			const payload: UpdateTagPayload = {
				id: data.id,
				name: data.name,
				slug,
			};

			if (data.hidden !== undefined) {
				payload.hidden = data.hidden;
			}

			return await updateTagAdapter(payload, currentStore.id);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["tags"] });
			queryClient.invalidateQueries({ queryKey: ["tag", data.id] });
			toast.success("Tag atualizada com sucesso!");
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao atualizar tag. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
