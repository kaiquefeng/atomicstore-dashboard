import { apiClient } from "@/services/api";

export interface UploadStoreBannersResponse {
	banners?: string[];
	urls?: string[];
	[key: string]: unknown;
}

/**
 * Uploads banner images directly to the store, same pattern as logo.
 * Sends multiple files as multipart/form-data to POST /stores/{id}/banners.
 */
export const uploadStoreBannersAdapter = async (
	storeId: string,
	files: File[],
): Promise<UploadStoreBannersResponse> => {
	const formData = new FormData();

	files.forEach((file) => {
		formData.append("file", file);
	});

	const response = await apiClient.post<UploadStoreBannersResponse>(
		`/stores/${storeId}/banners`,
		formData,
		{
			headers: {
				"Content-Type": undefined,
			},
		},
	);

	return response.data;
};
