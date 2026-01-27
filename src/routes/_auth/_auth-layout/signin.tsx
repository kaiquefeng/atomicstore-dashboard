import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";

export const Route = createFileRoute("/_auth/_auth-layout/signin")({
	component: Signin,
});

function Signin() {
	return <LoginForm />;
}
