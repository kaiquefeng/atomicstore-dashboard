import axios, {
	type AxiosError,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { auth } from "@/lib/auth";

let currentStoreSlug: string | undefined;

export function setStoreSlug(slug: string | undefined) {
	currentStoreSlug = slug;
}

export function getStoreSlug(): string | undefined {
	return currentStoreSlug;
}

export function buildStoreParams(storeId?: string) {
	const params: Record<string, string> = {};
	if (storeId) {
		params.storeId = storeId;
	}
	return params;
}

const apiClient: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "https://api.oatomicstore.com",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

apiClient.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		try {
			const session = await auth.getSession();

			if (!session.error && session.data?.session) {
				const token = session.data.session.token;

				if (token && config.headers) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			}

			// if (currentStoreSlug && config.headers) {
			// 	config.headers["X-Store-Slug"] = currentStoreSlug;
			// }

			return config;
		} catch {
			return config;
		}
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	},
);

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			console.error("Unauthorized access");
		}
		return Promise.reject(error);
	},
);

export { apiClient };
