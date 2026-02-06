import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { StoreSlugSync } from "@/components/store-slug-sync";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { getStoresAdapter } from "@/features/stores/adapters/get-stores";
import { isAuthenticated } from "@/lib/auth-utils";
import { setStoreSlug } from "@/services/api";

export const Route = createFileRoute("/$store/_layout")({
	beforeLoad: async ({ params }) => {
		const authenticated = await isAuthenticated();
		if (!authenticated) {
			throw redirect({
				to: "/signin",
			});
		}

		const stores = await getStoresAdapter();

		const isValidStore = stores.some((store) => store.slug === params.store);

		if (!isValidStore && stores.length > 0) {
			const firstStore = stores[0];
			throw redirect({
				to: "/$store",
				params: { store: firstStore.slug },
			});
		}

		// Set the store slug in API client
		if (isValidStore) {
			setStoreSlug(params.store);
		}
	},
	component: StoreDashboardLayout,
});

function StoreDashboardLayout() {
	return (
		<SidebarProvider>
			<StoreSlugSync />
			<AppSidebar />
			<SidebarInset>
				<header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">
									Building Your Application
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Data Fetching</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
