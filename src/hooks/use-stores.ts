"use client";

import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { GalleryVerticalEnd } from "lucide-react";
import { getStoresAdapter } from "@/features/stores/adapters/get-stores";

export interface Store {
	id: string;
	name: string;
	slug: string;
	logo?: string;
	favicon?: string;
	plan?: string;
}

export interface StoreWithIcon {
	id: string;
	name: string;
	slug: string;
	logo: LucideIcon;
	favicon?: string;
	plan: string;
}

function mapStoreToSwitcherFormat(store: Store): StoreWithIcon {
	return {
		id: store.id,
		name: store.name,
		slug: store.slug,
		logo: GalleryVerticalEnd,
		favicon: store.favicon,
		plan: store.plan || "Free",
	};
}

export function useStores() {
	const {
		data: storesData = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["stores"],
		queryFn: async () => {
			const stores = await getStoresAdapter();

			const storesAsStore: Store[] = stores.map((store) => ({
				id: store.id,
				name: store.name,
				slug: store.slug,
				favicon: (store as { faviconUrl?: string }).faviconUrl,
				plan: undefined,
			}));
			return storesAsStore.map(mapStoreToSwitcherFormat);
		},
	});

	return {
		stores: storesData,
		isLoading,
		error: error
			? error instanceof Error
				? error
				: new Error("Failed to load stores")
			: null,
	};
}
