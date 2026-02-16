export type DomainStatus =
	| "pending"
	| "active"
	| "failed"
	| "verifying"
	| "removing";

export interface CustomDomain {
	id: string;
	storeId: string;
	host: string;
	status: DomainStatus;
	isPrimary: boolean;
	sslStatus?: string;
	dnsRecords?: DnsRecord[];
	createdAt: string;
	updatedAt?: string;
}

export interface DnsRecord {
	type: string;
	name: string;
	value: string;
	ttl?: number;
	isVerified: boolean;
}

export interface CreateCustomDomainPayload {
	host: string;
	setAsPrimary: boolean;
}

export interface CreateCustomDomainResponse {
	id: string;
	host: string;
	status: DomainStatus;
	isPrimary: boolean;
	dnsRecords?: DnsRecord[];
}

export interface VerifyCustomDomainResponse {
	id: string;
	host: string;
	status: DomainStatus;
	isVerified: boolean;
	dnsRecords?: DnsRecord[];
}
