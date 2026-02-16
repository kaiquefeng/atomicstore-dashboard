import { apiClient } from "@/services/api";
import type {
	CreateCustomDomainPayload,
	CreateCustomDomainResponse,
} from "../types";

export const createCustomDomainAdapter = async (
	storeId: string,
	payload: CreateCustomDomainPayload,
): Promise<CreateCustomDomainResponse> => {
	const response = await apiClient.post<CreateCustomDomainResponse>(
		`/stores/${storeId}/domains`,
		payload,
	);
	return response.data;
};
