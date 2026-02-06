import { auth } from "./auth";

export async function getSession() {
	try {
		const response = await auth.getSession();
		if (response.error) {
			return null;
		}
		return response.data?.session ?? null;
	} catch {
		return null;
	}
}

export async function isAuthenticated() {
	const session = await getSession();
	return !!session;
}
