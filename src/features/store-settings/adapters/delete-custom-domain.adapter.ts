import { apiClient } from "@/services/api";

export const deleteCustomDomainAdapter = async (
	storeId: string,
	domainId: string,
): Promise<{ success: boolean; message: string }> => {
	const response = await apiClient.delete<{
		success: boolean;
		message: string;
	}>(`/stores/${storeId}/domains/${domainId}`);
	return response.data;
};
