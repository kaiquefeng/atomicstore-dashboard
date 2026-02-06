import { createAuthClient } from "better-auth/client";

export const auth = createAuthClient({
	baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:3000",
	basePath: "/api/auth",
});

export type Session = Awaited<ReturnType<typeof auth.getSession>>;
