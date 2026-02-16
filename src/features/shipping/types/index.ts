export interface ShippingMethod {
	id: string;
	name: string;
	code: string;
	carrier: string;
	enabled: boolean;
	estimatedDays: string;
	additionalFee: number;
	storeId?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ShippingSettings {
	id?: string;
	carrier: string;
	apiKey?: string;
	contractCode?: string;
	postingCard?: string;
	originCep: string;
	enableFreeShipping: boolean;
	freeShippingMinValue?: number;
	freeShippingRegions?: string[];
	storeId?: string;
}

export interface CreateShippingMethodPayload {
	name: string;
	code: string;
	carrier: string;
	enabled: boolean;
	estimatedDays: string;
	additionalFee: number;
	storeId: string;
}

export interface UpdateShippingMethodPayload {
	id: string;
	name?: string;
	code?: string;
	carrier?: string;
	enabled?: boolean;
	estimatedDays?: string;
	additionalFee?: number;
}
