import { apiClient } from "@/services/api";
import type { CustomDomain } from "../types";

interface CustomDomainApiResponse {
	id: string;
	storeId: string;
	host: string;
	status: string;
	isPrimary?: boolean;
	sslStatus?: string;
	dnsRecords?: Array<{
		type: string;
		name: string;
		value: string;
		ttl?: number;
		isVerified?: boolean;
	}>;
	createdAt: string;
	updatedAt?: string;
}

function mapApiResponseToCustomDomain(
	item: CustomDomainApiResponse,
): CustomDomain {
	return {
		id: item.id,
		storeId: item.storeId,
		host: item.host,
		status: (item.status as CustomDomain["status"]) ?? "pending",
		isPrimary: item.isPrimary ?? false,
		sslStatus: item.sslStatus,
		dnsRecords: item.dnsRecords?.map((record) => ({
			type: record.type,
			name: record.name,
			value: record.value,
			ttl: record.ttl,
			isVerified: record.isVerified ?? false,
		})),
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
	};
}

export const getCustomDomainsAdapter = async (
	storeId: string,
): Promise<CustomDomain[]> => {
	const response = await apiClient.get<
		| CustomDomainApiResponse[]
		| {
				domains?: CustomDomainApiResponse[];
				data?: CustomDomainApiResponse[];
		  }
	>(`/stores/${storeId}/domains`);

	const data = response.data;
	const domainsList = Array.isArray(data)
		? data
		: data.domains || data.data || [];

	return domainsList.map(mapApiResponseToCustomDomain);
};
