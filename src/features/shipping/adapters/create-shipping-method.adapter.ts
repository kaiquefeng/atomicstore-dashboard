import { apiClient } from "@/services/api";
import type { CreateShippingMethodPayload, ShippingMethod } from "../types";

export const createShippingMethodAdapter = async (
	payload: CreateShippingMethodPayload,
): Promise<ShippingMethod> => {
	const response = await apiClient.post<ShippingMethod>(
		"/shipping/methods/create",
		payload,
	);

	return response.data;
};
