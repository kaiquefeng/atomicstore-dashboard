import { apiClient } from "@/services/api";
import type { PaymentMethod } from "../types";

export interface CreatePaymentMethodPayload {
	name: string;
	slug: string;
	metadata?: Record<string, string>;
}

export interface CreatePaymentMethodResponse {
	id: string;
	name?: string;
	description?: string;
	slug?: string;
	metadata?: Record<string, string>;
	[key: string]: unknown;
}

export const createAdminPaymentMethodAdapter = async (
	payload: CreatePaymentMethodPayload,
): Promise<PaymentMethod> => {
	const response = await apiClient.post<CreatePaymentMethodResponse>(
		"/payment-methods/",
		payload,
	);

	const data = response.data;
	return {
		id: data.id,
		name: data.name ?? payload.name,
		slug: data.slug ?? payload.slug,
		metadata: data.metadata ?? ({} as Record<string, string>),
		createdAt: data.createdAt as string,
		updatedAt: data.updatedAt as string,
	};
};
