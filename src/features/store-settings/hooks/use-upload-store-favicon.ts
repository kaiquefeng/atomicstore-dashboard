"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import toast from "react-hot-toast";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import { uploadStoreFaviconAdapter } from "../adapters/upload-store-favicon.adapter";

export function useUploadStoreFavicon() {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();
	const queryClient = useQueryClient();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	return useMutation({
		mutationFn: async (file: File) => {
			const storeId = currentStore?.id;
			if (!storeId) throw new Error("Store not found");
			return uploadStoreFaviconAdapter(storeId, file);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["stores"] });
			queryClient.invalidateQueries({ queryKey: ["store-details"] });
			toast.success("Favicon atualizado com sucesso!");
		},
		onError: () => {
			toast.error("Erro ao enviar favicon. Tente novamente.");
		},
	});
}
