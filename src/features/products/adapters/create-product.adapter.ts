import { apiClient } from "@/services/api";

export interface DefaultVariant {
	isDefault: boolean;
	priceBrl: number; // greater than 0
	sku: string; // min length: 1
	barcode: string;
	compareAtPriceBrl?: number;
	costBrl?: number;
	stock?: number;
	weightKg?: number;
	lengthCm?: number;
	widthCm?: number;
	heightCm?: number;
	metadata?: Record<string, string | undefined>;
	[key: string]: unknown;
}

export interface ProductVariant {
	sku: string;
	priceBrl: number;
	compareAtBrl?: number;
	title: string;
	barcode: string;
	isDefault: boolean;
	metadata?: Record<string, string | undefined>;
	[key: string]: unknown;
}

export interface CreateProductPayload {
	slug: string;
	title: string;
	status: "draft" | "active" | "archived";
	storeId: string;
	variants: ProductVariant[];
	description?: string;
	images?: Array<{
		id?: string;
		url?: string;
		alt?: string;
		sortOrder?: number;
		[key: string]: unknown;
	}>;
	properties?: Array<{
		title: string;
		options: string[];
	}>;
}

export interface CreateProductResponse {
	id: string;
	slug: string;
	title: string;
	status: string;
	storeId: string;
	[key: string]: unknown;
}

export const createProductAdapter = async (
	payload: CreateProductPayload,
): Promise<CreateProductResponse> => {
	const response = await apiClient.post<CreateProductResponse>(
		"/catalog/products/create",
		{
			metadata: {
				properties: payload.properties,
			},
			...payload,
		},
	);
	return response.data;
};
