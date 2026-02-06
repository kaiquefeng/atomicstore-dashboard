import axios, {
	type AxiosError,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import { auth } from "@/lib/auth";

// Store the current store slug - will be updated by components
let currentStoreSlug: string | undefined;

export function setStoreSlug(slug: string | undefined) {
	currentStoreSlug = slug;
}

export function getStoreSlug(): string | undefined {
	return currentStoreSlug;
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
		const session = await auth.getSession();

		if (session.error || !session.data?.session) {
			throw new Error("Not authenticated");
		}

		const token = session.data.session.token;

		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// Add store slug to requests if available
		// Option 1: As header
		if (currentStoreSlug && config.headers) {
			config.headers["X-Store-Slug"] = currentStoreSlug;
		}

		// Option 2: As query parameter (uncomment if preferred)
		// if (currentStoreSlug && config.params) {
		//   config.params.store = currentStoreSlug;
		// }

		return config;
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
