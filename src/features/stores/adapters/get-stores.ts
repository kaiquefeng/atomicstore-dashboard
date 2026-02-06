import { apiClient } from "@/services/api";

export const getStoresAdapter = async () => {
	const response = await apiClient.get<
		| { id: string; name: string; slug: string }[]
		| {
				stores?: { id: string; name: string; slug: string }[];
				data?: { id: string; name: string; slug: string }[];
		  }
	>("/stores/all");

	const data = response.data;
	const storesList = Array.isArray(data)
		? data
		: data.stores || data.data || [];

	return storesList;
};
