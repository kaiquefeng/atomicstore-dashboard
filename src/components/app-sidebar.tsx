"use client";

import {
	Frame,
	LayoutGrid,
	PieChart,
	Settings2,
	ShoppingBag,
	Truck,
	UsersRound,
} from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useStores } from "@/hooks/use-stores";
import { StoreSwitcher } from "./store-switcher";

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Home",
			url: "/$store",
			icon: LayoutGrid,
			isActive: true,
			items: [],
		},
		{
			title: "Minha loja",
			url: "#",
			icon: ShoppingBag,
			items: [
				{
					title: "Produtos",
					url: "/$store/products",
				},
				{
					title: "Categorias",
					url: "/$store/categories",
				},
				{
					title: "Pedidos",
					url: "/$store/orders",
				},
				{
					title: "Tags",
					url: "/$store/tags",
				},
				{
					title: "Imagens",
					url: "/$store/images",
				},
				{
					title: "Cupons",
					url: "/$store/coupons",
				},
			],
		},

		{
			title: "Clientes",
			url: "/customers",
			icon: UsersRound,
			items: [],
		},
		{
			title: "Métodos de envio",
			url: "/$store/settings/shipping",
			icon: Truck,
		},
		{
			title: "Configurações",
			url: "#",
			icon: Settings2,
			items: [
				{
					title: "Geral",
					url: "#",
				},

				{
					title: "Time",
					url: "#",
				},
				{
					title: "Cobrança",
					url: "#",
				},
			],
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user, signOut } = useAuth();
	const { stores, isLoading: isLoadingStores } = useStores();

	const userData = user
		? {
				name: user.name || user.email || "Usuário",
				email: user.email || "",
				avatar: user.image || "/avatars/default.jpg",
			}
		: {
				name: "Usuário",
				email: "",
				avatar: "/avatars/default.jpg",
			};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				{isLoadingStores ? (
					<div className="flex h-16 items-center justify-center">
						<span className="text-muted-foreground text-sm">
							Carregando lojas...
						</span>
					</div>
				) : stores.length > 0 ? (
					<StoreSwitcher stores={stores} />
				) : null}
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} onSignOut={signOut} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
