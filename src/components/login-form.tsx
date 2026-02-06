"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	type SigninFormData,
	signinSchema,
} from "@/features/auth/schemas/signin";
import { useAuth } from "@/hooks/use-auth";
import { useStores } from "@/hooks/use-stores";
import { cn } from "@/lib/utils";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const emailId = useId();
	const passwordId = useId();
	const navigate = useNavigate();
	const { signIn, isSigningIn } = useAuth();
	const { stores } = useStores();
	const [authError, setAuthError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SigninFormData>({
		resolver: zodResolver(signinSchema),
	});

	async function onSubmit(data: SigninFormData) {
		setAuthError(null);
		try {
			await signIn(data);
			// Wait a bit for stores to load if not already loaded
			const firstStore = stores.length > 0 ? stores[0] : null;
			if (firstStore) {
				navigate({
					to: "/$store",
					params: { store: firstStore.slug },
				});
			} else {
				// Fallback if stores not loaded yet
				navigate({
					to: "/$store",
					params: { store: "default" },
				});
			}
		} catch (err) {
			setAuthError(
				err instanceof Error
					? err.message
					: "Erro ao fazer login. Verifique suas credenciais.",
			);
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<div className="flex flex-col items-center gap-2 font-medium">
							<div className="flex size-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
							<span className="sr-only">Acme Inc.</span>
						</div>
						<h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
						<FieldDescription>
							Don&apos;t have an account? <span>Sign up</span>
						</FieldDescription>
					</div>
					<Field>
						<FieldLabel htmlFor={emailId}>Email</FieldLabel>
						<Input
							id={emailId}
							type="email"
							placeholder="m@example.com"
							{...register("email")}
						/>
						<FieldError errors={errors.email ? [errors.email] : []} />
					</Field>
					<Field>
						<FieldLabel htmlFor={passwordId}>Senha</FieldLabel>
						<Input
							id={passwordId}
							type="password"
							placeholder="Digite sua senha"
							{...register("password")}
						/>
						<FieldError errors={errors.password ? [errors.password] : []} />
					</Field>
					{authError && (
						<Field>
							<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
								{authError}
							</div>
						</Field>
					)}
					<Field>
						<Button type="submit" disabled={isSigningIn}>
							{isSigningIn ? "Entrando..." : "Login"}
						</Button>
					</Field>
				</FieldGroup>
			</form>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<span className="underline">Terms of Service</span> and{" "}
				<span className="underline">Privacy Policy</span>.
			</FieldDescription>
		</div>
	);
}
