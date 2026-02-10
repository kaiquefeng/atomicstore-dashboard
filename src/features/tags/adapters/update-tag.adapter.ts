import { apiClient, buildStoreParams } from "@/services/api";
import type { CreateTagResponse } from "./create-tag.adapter";

export interface UpdateTagPayload {
	id: string;
	name: string;
	slug: string;
	hidden?: boolean;
}

export const updateTagAdapter = async (
	payload: UpdateTagPayload,
	storeId?: string,
): Promise<CreateTagResponse> => {
	const { id, ...tagData } = payload;

	const requestPayload: Record<string, unknown> = {
		name: tagData.name,
		slug: tagData.slug,
	};

	if (tagData.hidden !== undefined) {
		requestPayload.isActive = !tagData.hidden;
	}

	const params = buildStoreParams(storeId);

	const response = await apiClient.put<CreateTagResponse>(
		`/catalog/tags/${id}`,
		requestPayload,
		{
			params,
		},
	);

	return response.data;
};
