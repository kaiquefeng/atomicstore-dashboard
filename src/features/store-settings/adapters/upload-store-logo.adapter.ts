import { apiClient } from "@/services/api";

export interface UploadStoreLogoResponse {
	url?: string;
	logo?: string;
	[key: string]: unknown;
}

export const uploadStoreLogoAdapter = async (
	storeId: string,
	file: File,
): Promise<UploadStoreLogoResponse> => {
	const formData = new FormData();
	formData.append("file", file);

	const response = await apiClient.post<UploadStoreLogoResponse>(
		`/stores/${storeId}/logo`,
		formData,
		{
			headers: {
				"Content-Type": undefined,
			},
		},
	);

	return response.data;
};
