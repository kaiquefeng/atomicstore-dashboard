import { apiClient } from "@/services/api";

export interface CreateStorePayload {
	name: string;
	slug: string;
}

export interface CreateStoreResponse {
	id: string;
	name: string;
	slug: string;
}

export const createStoreAdapter = async (
	payload: CreateStorePayload,
): Promise<CreateStoreResponse> => {
	const response = await apiClient.post<CreateStoreResponse>(
		"/stores/create",
		payload,
	);
	return response.data;
};
