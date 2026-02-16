import { apiClient, buildStoreParams } from "@/services/api";
import type { UpdateShippingMethodPayload, ShippingMethod } from "../types";

export const updateShippingMethodAdapter = async (
	payload: UpdateShippingMethodPayload,
	storeId?: string,
): Promise<ShippingMethod> => {
	const { id, ...updateData } = payload;
	const params = buildStoreParams(storeId);

	const response = await apiClient.put<ShippingMethod>(
		`/shipping/methods/${id}`,
		updateData,
		{
			params,
		},
	);

	return response.data;
};
