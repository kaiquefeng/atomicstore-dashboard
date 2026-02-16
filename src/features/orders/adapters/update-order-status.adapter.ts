import { apiClient, buildStoreParams } from "@/services/api";

export interface UpdateOrderStatusPayload {
	orderId: string;
	paymentStatus?: string;
	fulfilmentStatus?: string;
	status?: string;
}

export interface UpdateOrderStatusResponse {
	id: string;
	success?: boolean;
	[key: string]: unknown;
}

export const updateOrderStatusAdapter = async (
	payload: UpdateOrderStatusPayload,
	storeId?: string,
): Promise<UpdateOrderStatusResponse> => {
	const { orderId, ...statusData } = payload;
	const params = buildStoreParams(storeId);

	const response = await apiClient.patch<UpdateOrderStatusResponse>(
		`/orders/${orderId}/status`,
		statusData,
		{
			params,
		},
	);

	return response.data;
};
