import { apiClient, buildStoreParams } from "@/services/api";

export interface DeleteTagResponse {
	id: string;
	success?: boolean;
	[key: string]: unknown;
}

export const deleteTagAdapter = async (
	tagId: string,
	storeId?: string,
): Promise<DeleteTagResponse> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.delete<DeleteTagResponse>(
		`/catalog/tags/${tagId}`,
		{
			params,
		},
	);

	return response.data;
};
