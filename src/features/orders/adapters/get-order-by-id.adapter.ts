import { apiClient, buildStoreParams } from "@/services/api";
import type { Order } from "../types";
import type { OrderApiResponse } from "./get-orders.adapter";

function mapApiResponseToOrder(order: OrderApiResponse): Order {
	const customer =
		typeof order.customer === "string"
			? { name: order.customer }
			: (order.customer ?? { name: "" });

	const shippingAddress =
		order.shippingAddress ??
		(order.location ? { fullAddress: order.location as string } : undefined);

	return {
		id: order.id,
		orderNumber: order.orderNumber ?? order.id,
		status: (order.status as Order["status"]) ?? "open",
		paymentStatus: (order.paymentStatus as Order["paymentStatus"]) ?? "pending",
		fulfilmentStatus:
			(order.fulfilmentStatus as Order["fulfilmentStatus"]) ?? "unfulfilled",
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

export const getOrderByIdAdapter = async (
	orderId: string,
	storeId?: string,
): Promise<Order> => {
	const params = buildStoreParams(storeId);

	const response = await apiClient.get<
		OrderApiResponse | { order?: OrderApiResponse; data?: OrderApiResponse }
	>(`/orders/${orderId}`, {
		params,
	});

	const data = response.data;
	const order =
		"order" in data && data.order
			? data.order
			: "data" in data && data.data
				? data.data
				: (data as OrderApiResponse);

	return mapApiResponseToOrder(order as OrderApiResponse);
};
