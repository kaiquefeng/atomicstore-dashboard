import { apiClient } from "@/services/api";
import type { PaymentMethod } from "../types";

export interface PaymentMethodApiResponse {
	id: string;
	name: string;
	description?: string;
	slug: string;
	config?: Record<string, string>;
	[key: string]: unknown;
}

export const getAdminPaymentMethodsAdapter = async (): Promise<
	PaymentMethod[]
> => {
	const response = await apiClient.get<
		| PaymentMethodApiResponse[]
		| {
				methods?: PaymentMethodApiResponse[];
				data?: PaymentMethodApiResponse[];
		  }
	>("/payment-methods/");

	const data = response.data;
	const methodsList = Array.isArray(data)
		? data
		: data?.methods || data?.data || [];

	return methodsList.map((method) => ({
		id: method.id,
		name: method.name,
		slug: method.slug,
		metadata: method.metadata as Record<string, string>,
		createdAt: method.createdAt as string,
		updatedAt: method.updatedAt as string,
	}));
};
