"use client";

import { useEffect } from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { setStoreSlug } from "@/services/api";

/**
 * Component that syncs the current store slug from URL to the API client
 * Should be rendered inside routes that have the $store parameter
 */
export function StoreSlugSync() {
	const storeSlug = useStoreSlug();

	useEffect(() => {
		setStoreSlug(storeSlug);
	}, [storeSlug]);

	return null;
}
