import { apiClient } from "@/services/api";

export interface UploadedImage {
	id: string;
	url?: string;
	[key: string]: unknown;
}

export const uploadProductImagesAdapter = async (
	files: File[],
): Promise<UploadedImage[]> => {
	const formData = new FormData();

	files.forEach((file) => {
		formData.append("file", file);
	});

	const response = await apiClient.post<UploadedImage[]>(
		"/catalog/product-images/upload",
		formData,
		{
			headers: {
				"Content-Type": undefined,
			},
		},
	);

	return response.data;
};
