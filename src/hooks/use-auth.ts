"use client";

import { useEffect, useState } from "react";
import type { SigninFormData } from "@/features/auth/schemas/signin";
import { auth } from "@/lib/auth";

export function useAuth() {
	const [session, setSession] = useState<Awaited<
		ReturnType<typeof auth.getSession>
	> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSigningIn, setIsSigningIn] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function loadSession() {
			try {
				const response = await auth.getSession();
				if (response.error) {
					setError(
						new Error(response.error.message || "Failed to load session"),
					);
					setSession(null);
				} else {
					setSession(response);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to load session"),
				);
				setSession(null);
			} finally {
				setIsLoading(false);
			}
		}
		loadSession();
	}, []);

	const handleSignIn = async (data: SigninFormData) => {
		setIsSigningIn(true);
		setError(null);
		try {
			const result = await auth.signIn.email({
				email: data.email,
				password: data.password,
			});
			if (result.error) {
				throw new Error(result.error.message || "Failed to sign in");
			}
			// Reload session after successful sign in
			const sessionResponse = await auth.getSession();
			if (sessionResponse.error) {
				throw new Error(
					sessionResponse.error.message || "Failed to load session",
				);
			}
			setSession(sessionResponse);
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to sign in");
			setError(error);
			throw error;
		} finally {
			setIsSigningIn(false);
		}
	};

	const handleSignOut = async () => {
		setIsSigningOut(true);
		setError(null);
		try {
			await auth.signOut();
			setSession(null);
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error("Failed to sign out");
			setError(error);
			throw error;
		} finally {
			setIsSigningOut(false);
		}
	};

	return {
		session: session?.data?.session ?? null,
		user: session?.data?.user ?? null,
		isLoading,
		isAuthenticated: !!session?.data?.session,
		signIn: handleSignIn,
		signOut: handleSignOut,
		isSigningIn,
		isSigningOut,
		error,
	};
}
