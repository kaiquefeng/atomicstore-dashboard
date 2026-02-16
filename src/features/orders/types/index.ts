export type PaymentStatus = "paid" | "pending" | "unpaid";
export type FulfilmentStatus = "fulfilled" | "unfulfilled";
export type OrderStatus = "open" | "closed" | "cancelled";

export interface OrderItem {
	id: string;
	productId: string;
	productTitle: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	thumbnail?: string;
	sku?: string;
	variantTitle?: string;
}

export interface OrderCustomer {
	id?: string;
	name: string;
	email?: string;
	phone?: string;
}

export interface OrderAddress {
	street?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	country?: string;
	fullAddress?: string;
}

export interface Order {
	id: string;
	orderNumber: string;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	fulfilmentStatus: FulfilmentStatus;
	customer: OrderCustomer;
	shippingAddress?: OrderAddress;
	items: OrderItem[];
	itemsCount: number;
	subtotal: number;
	shippingCost: number;
	discount: number;
	total: number;
	currency: string;
	notes?: string;
	thumbnail?: string;
	createdAt: string;
	updatedAt?: string;
	storeId?: string;
}
