"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
	type CreateStorePayload,
	type CreateStoreResponse,
	createStoreAdapter,
} from "@/features/stores/adapters/create-store.adapter";

export function useCreateStore() {
	const queryClient = useQueryClient();

	return useMutation<CreateStoreResponse, Error, CreateStorePayload>({
		mutationFn: createStoreAdapter,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["stores"] });
			toast.success("Loja criada com sucesso!");
			return data;
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao criar loja. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
