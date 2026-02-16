import { apiClient, buildStoreParams } from "@/services/api";
import type { ShippingSettings } from "../types";

export const getShippingSettingsAdapter = async (
	storeId?: string,
): Promise<ShippingSettings> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.get<
		| ShippingSettings
		| {
				settings?: ShippingSettings;
				data?: ShippingSettings;
		  }
	>("/shipping/settings", {
		params,
	});

	const data = response.data;

	if ("carrier" in data) {
		return data as ShippingSettings;
	}

	const nested = data as { settings?: ShippingSettings; data?: ShippingSettings };
	return nested.settings || nested.data || (data as ShippingSettings);
};
