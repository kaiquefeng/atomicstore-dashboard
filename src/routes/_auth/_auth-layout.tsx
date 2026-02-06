import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getStoresAdapter } from "@/features/stores/adapters/get-stores";
import { isAuthenticated } from "@/lib/auth-utils";

export const Route = createFileRoute("/_auth/_auth-layout")({
	beforeLoad: async () => {
		const authenticated = await isAuthenticated();
		if (authenticated) {
			const stores = await getStoresAdapter();
			const firstStore = stores.length > 0 ? stores[0] : null;
			if (firstStore) {
				throw redirect({
					to: "/$store",
					params: { store: firstStore.slug },
				});
			} else {
				// Fallback if no stores available
				throw redirect({
					to: "/$store",
					params: { store: "default" },
				});
			}
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Outlet />
			</div>
		</div>
	);
}
