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
import * as React from "react";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user, signOut } = useAuth();
	const { stores, isLoading: isLoadingStores } = useStores();

	const navMain = React.useMemo(() => {
		return [
			{
				title: "Home",
				url: "/",
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
						url: "/products",
					},
					{
						title: "Categorias",
						url: "/categories",
					},
					{
						title: "Pedidos",
						url: "/orders",
					},
					{
						title: "Tags",
						url: "/tags",
					},
					{
						title: "Imagens",
						url: "/images",
					},
					{
						title: "Cupons",
						url: "/coupons",
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
				url: "/settings/shipping",
				icon: Truck,
			},
			{
				title: "Configurações",
				url: "#",
				icon: Settings2,
				items: [
					{
						title: "Geral",
						url: "/settings/general",
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
		];
	}, []);

	const projects = [
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
	];

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
				<NavMain items={navMain} />
				<NavProjects projects={projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} onSignOut={signOut} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
