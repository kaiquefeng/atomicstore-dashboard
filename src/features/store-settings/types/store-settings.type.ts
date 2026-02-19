export interface StoreDetails {
	id: string;
	name: string;
	slug: string;
	logo?: string;
	description?: string;
	socialLinks?: Record<string, string>;
	createdAt?: string;
	updatedAt?: string;
}

export interface UpdateStorePayload {
	name?: string;
	slug?: string;
	description?: string;
	socialLinks?: Record<string, string>;
}

export interface UpdateStoreResponse {
	id: string;
	name: string;
	slug: string;
}
