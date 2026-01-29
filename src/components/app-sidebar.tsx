"use client";

import {
	AudioWaveform,
	Command,
	Frame,
	GalleryVerticalEnd,
	LayoutGrid,
	PieChart,
	Settings2,
	ShoppingBag,
	UsersRound,
} from "lucide-react";
import type * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
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
					url: "#",
				},
				{
					title: "Tags",
					url: "/$store/tags",
				},
				{
					title: "Imagens",
					url: "#",
				},
				{
					title: "Cupons",
					url: "#",
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
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
