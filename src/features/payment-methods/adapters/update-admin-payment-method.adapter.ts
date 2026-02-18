import { apiClient } from "@/services/api";
import type { PaymentMethod } from "../types";

export interface UpdatePaymentMethodPayload {
	name: string;
	slug: string;
	metadata?: Record<string, string>;
}

export interface UpdatePaymentMethodResponse {
	id: string;
	name?: string;
	slug?: string;
	metadata?: Record<string, string>;
	[key: string]: unknown;
}

export const updateAdminPaymentMethodAdapter = async (
	id: string,
	payload: UpdatePaymentMethodPayload,
): Promise<PaymentMethod> => {
	const response = await apiClient.put<UpdatePaymentMethodResponse>(
		`/payment-methods/${id}`,
		payload,
	);

	const data = response.data;
	return {
		id: data.id,
		name: data.name ?? payload.name,
		slug: data.slug ?? payload.slug,
		metadata: (data.metadata ?? {}) as Record<string, string>,
		createdAt: (data as { createdAt?: string }).createdAt ?? "",
		updatedAt: (data as { updatedAt?: string }).updatedAt ?? "",
	};
};
