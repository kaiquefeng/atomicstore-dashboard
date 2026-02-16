import { apiClient, buildStoreParams } from "@/services/api";
import type { Order } from "../types";

export interface OrderApiResponse {
	id: string;
	orderNumber?: string;
	status?: string;
	paymentStatus?: string;
	fulfilmentStatus?: string;
	customer?: string | { id?: string; name: string; email?: string; phone?: string };
	shippingAddress?: {
		street?: string;
		city?: string;
		state?: string;
		zipCode?: string;
		country?: string;
		fullAddress?: string;
	};
	items?: Array<{
		id: string;
		productId: string;
		productTitle: string;
		quantity: number;
		unitPrice: number;
		totalPrice: number;
		thumbnail?: string;
		sku?: string;
		variantTitle?: string;
	}>;
	itemsCount?: number;
	subtotal?: number;
	shippingCost?: number;
	discount?: number;
	total?: number;
	currency?: string;
	notes?: string;
	thumbnail?: string;
	createdAt?: string;
	date?: string;
	updatedAt?: string;
	location?: string;
	storeId?: string;
	[key: string]: unknown;
}

function mapApiResponseToOrder(order: OrderApiResponse): Order {
	const customer =
		typeof order.customer === "string"
			? { name: order.customer }
			: order.customer ?? { name: "" };

	const shippingAddress = order.shippingAddress ??
		(order.location
			? { fullAddress: order.location as string }
			: undefined);

	return {
		id: order.id,
		orderNumber: order.orderNumber ?? order.id,
		status: (order.status as Order["status"]) ?? "open",
		paymentStatus: (order.paymentStatus as Order["paymentStatus"]) ?? "pending",
		fulfilmentStatus: (order.fulfilmentStatus as Order["fulfilmentStatus"]) ?? "unfulfilled",
		customer,
		shippingAddress,
		items: order.items ?? [],
		itemsCount: order.itemsCount ?? order.items?.length ?? 0,
		subtotal: order.subtotal ?? order.total ?? 0,
		shippingCost: order.shippingCost ?? 0,
		discount: order.discount ?? 0,
		total: order.total ?? 0,
		currency: order.currency ?? "USD",
		notes: order.notes,
		thumbnail: order.thumbnail,
		createdAt: order.createdAt ?? order.date ?? new Date().toISOString(),
		updatedAt: order.updatedAt,
		storeId: order.storeId,
	};
}

export const getOrdersAdapter = async (storeId?: string): Promise<Order[]> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.get<
		| OrderApiResponse[]
		| {
				orders?: OrderApiResponse[];
				data?: OrderApiResponse[];
				items?: OrderApiResponse[];
		  }
	>("/orders/all", {
		params,
	});

	const data = response.data;
	const ordersList = Array.isArray(data)
		? data
		: data.orders || data.data || data.items || [];

	return ordersList.map(mapApiResponseToOrder);
};
