import { createAuthClient } from "better-auth/client";

export const auth = createAuthClient({
	baseURL: import.meta.env.VITE_API_URL,
	basePath: "/api/auth",
});

export type Session = Awaited<ReturnType<typeof auth.getSession>>;
