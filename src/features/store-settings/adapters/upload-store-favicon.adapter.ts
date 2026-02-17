import { apiClient } from "@/services/api";

export interface UploadStoreFaviconResponse {
	url?: string;
	favicon?: string;
	[key: string]: unknown;
}

export const uploadStoreFaviconAdapter = async (
	storeId: string,
	file: File,
): Promise<UploadStoreFaviconResponse> => {
	const formData = new FormData();
	formData.append("file", file);

	const response = await apiClient.post<UploadStoreFaviconResponse>(
		`/stores/${storeId}/favicon`,
		formData,
		{
			headers: {
				"Content-Type": undefined,
			},
		},
	);

	return response.data;
};
