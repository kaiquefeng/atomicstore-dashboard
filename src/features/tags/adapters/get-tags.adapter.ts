import { apiClient, buildStoreParams } from "@/services/api";
import type { Tag } from "../types";

export interface TagApiResponse {
	id: string;
	name: string;
	slug: string;
	isActive?: boolean;
	storeId?: string;
	[key: string]: unknown;
}

export const getTagsAdapter = async (storeId?: string): Promise<Tag[]> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.get<
		| TagApiResponse[]
		| {
				tags?: TagApiResponse[];
				data?: TagApiResponse[];
				items?: TagApiResponse[];
		  }
	>("/catalog/tags/all", {
		params,
	});

	const data = response.data;
	const tagsList = Array.isArray(data)
		? data
		: data.tags || data.data || data.items || [];

	return tagsList.map((tag) => ({
		id: tag.id,
		name: tag.name,
		slug: tag.slug,
		hidden: tag.isActive === false,
	}));
};
