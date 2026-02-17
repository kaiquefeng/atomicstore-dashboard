import { apiClient } from "@/services/api";

export interface StoreDetailsResponse {
	id: string;
	name: string;
	slug: string;
	logo?: string;
	banners?: string[];
	description?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
}

export const getStoreAdapter = async (
	storeId: string,
): Promise<StoreDetailsResponse> => {
	const response = await apiClient.get<StoreDetailsResponse>(
		`/stores/${storeId}`,
	);
	return response.data;
};
