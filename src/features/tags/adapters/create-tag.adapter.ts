import { apiClient } from "@/services/api";

export interface CreateTagPayload {
	name: string;
	slug: string;
	storeId: string;
	hidden?: boolean;
}

export interface CreateTagResponse {
	id: string;
	name: string;
	slug: string;
	hidden?: boolean;
	storeId?: string;
	[key: string]: unknown;
}

export const createTagAdapter = async (
	payload: CreateTagPayload,
): Promise<CreateTagResponse> => {
	const requestPayload: Record<string, unknown> = {
		name: payload.name,
		slug: payload.slug,
		storeId: payload.storeId,
	};

	if (payload.hidden !== undefined) {
		requestPayload.isActive = !payload.hidden;
	}

	const response = await apiClient.post<CreateTagResponse>(
		"/catalog/tags/create",
		requestPayload,
	);

	return response.data;
};
