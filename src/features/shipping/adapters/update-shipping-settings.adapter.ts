import { apiClient, buildStoreParams } from "@/services/api";
import type { ShippingSettings } from "../types";

export const updateShippingSettingsAdapter = async (
	settings: Partial<ShippingSettings>,
	storeId?: string,
): Promise<ShippingSettings> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.put<ShippingSettings>(
		"/shipping/settings",
		settings,
		{
			params,
		},
	);

	return response.data;
};
