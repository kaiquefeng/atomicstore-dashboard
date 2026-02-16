export interface StoreDetails {
	id: string;
	name: string;
	slug: string;
	logo?: string;
	description?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface UpdateStorePayload {
	name?: string;
	slug?: string;
	description?: string;
}

export interface UpdateStoreResponse {
	id: string;
	name: string;
	slug: string;
}
