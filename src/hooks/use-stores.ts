"use client";

import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { GalleryVerticalEnd } from "lucide-react";
import { apiClient } from "@/services/api";

export interface Store {
	id: string;
	name: string;
	logo?: string;
	plan?: string;
	// Add other fields from API response as needed
}

export interface StoreWithIcon {
	id: string;
	name: string;
	logo: LucideIcon;
	plan: string;
}

// Map store data to the format expected by StoreSwitcher
function mapStoreToSwitcherFormat(store: Store): StoreWithIcon {
	// For now, use a default icon. You can enhance this to use different icons
	// based on store data or fetch/store logos
	return {
		id: store.id,
		name: store.name,
		logo: GalleryVerticalEnd, // Default icon, can be customized
		plan: store.plan || "Free",
	};
}

async function fetchStores(): Promise<StoreWithIcon[]> {
	const response = await apiClient.get<
		Store[] | { stores?: Store[]; data?: Store[] }
	>("/stores/all");

	const data = response.data;
	const storesList: Store[] = Array.isArray(data)
		? data
		: data.stores || data.data || [];

	return storesList.map(mapStoreToSwitcherFormat);
}

export function useStores() {
	const {
		data: stores = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["stores"],
		queryFn: fetchStores,
	});

	return {
		stores,
		isLoading,
		error: error
			? error instanceof Error
				? error
				: new Error("Failed to load stores")
			: null,
	};
}
