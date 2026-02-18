import { apiClient } from "@/services/api";

export interface DeletePaymentMethodResponse {
	success: boolean;
	message?: string;
}

export const deleteAdminPaymentMethodAdapter = async (
	id: string,
): Promise<DeletePaymentMethodResponse> => {
	const response = await apiClient.delete<DeletePaymentMethodResponse>(
		`/payment-methods/${id}`,
	);
	return response.data;
};
