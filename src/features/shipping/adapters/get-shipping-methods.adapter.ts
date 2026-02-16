import { apiClient, buildStoreParams } from "@/services/api";
import type { ShippingMethod } from "../types";

export interface ShippingMethodApiResponse {
	id: string;
	name: string;
	code: string;
	carrier: string;
	enabled: boolean;
	estimatedDays: string;
	additionalFee: number;
	storeId?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
}

export const getShippingMethodsAdapter = async (
	storeId?: string,
): Promise<ShippingMethod[]> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.get<
		| ShippingMethodApiResponse[]
		| {
				methods?: ShippingMethodApiResponse[];
				data?: ShippingMethodApiResponse[];
				items?: ShippingMethodApiResponse[];
		  }
	>("/shipping/methods/all", {
		params,
	});

	const data = response.data;
	const methodsList = Array.isArray(data)
		? data
		: data.methods || data.data || data.items || [];

	return methodsList.map((method) => ({
		id: method.id,
		name: method.name,
		code: method.code,
		carrier: method.carrier,
		enabled: method.enabled,
		estimatedDays: method.estimatedDays,
		additionalFee: method.additionalFee,
		storeId: method.storeId,
		createdAt: method.createdAt,
		updatedAt: method.updatedAt,
	}));
};
