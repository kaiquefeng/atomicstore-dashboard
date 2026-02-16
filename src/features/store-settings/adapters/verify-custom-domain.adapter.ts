import { apiClient } from "@/services/api";
import type { VerifyCustomDomainResponse } from "../types";

export const verifyCustomDomainAdapter = async (
	storeId: string,
	domainId: string,
): Promise<VerifyCustomDomainResponse> => {
	const response = await apiClient.post<VerifyCustomDomainResponse>(
		`/stores/${storeId}/domains/${domainId}/verify`,
	);
	return response.data;
};
