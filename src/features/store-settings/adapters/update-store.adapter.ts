import { apiClient } from "@/services/api";
import type { UpdateStorePayload, UpdateStoreResponse } from "../types";

export const updateStoreAdapter = async (
	storeId: string,
	payload: UpdateStorePayload,
): Promise<UpdateStoreResponse> => {
	const response = await apiClient.put<UpdateStoreResponse>(
		`/stores/${storeId}`,
		payload,
	);
	return response.data;
};
