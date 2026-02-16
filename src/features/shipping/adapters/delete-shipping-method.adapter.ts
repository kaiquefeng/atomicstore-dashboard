import { apiClient, buildStoreParams } from "@/services/api";

export interface DeleteShippingMethodResponse {
	id: string;
	success?: boolean;
	[key: string]: unknown;
}

export const deleteShippingMethodAdapter = async (
	methodId: string,
	storeId?: string,
): Promise<DeleteShippingMethodResponse> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.delete<DeleteShippingMethodResponse>(
		`/shipping/methods/${methodId}`,
		{
			params,
		},
	);

	return response.data;
};
