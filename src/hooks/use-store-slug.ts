"use client";

import { useParams } from "@tanstack/react-router";

/**
 * Hook para obter o slug da store atual da URL
 * Deve ser usado apenas dentro de rotas que têm o parâmetro $store
 */
export function useStoreSlug(): string | undefined {
	const params = useParams({ strict: false });
	return params.store;
}
