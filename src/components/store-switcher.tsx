"use client";

import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";
import { StoreCreateModal } from "@/components/store-create-modal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function StoreSwitcher({
	stores,
}: {
	stores: {
		id?: string;
		name: string;
		slug: string;
		logo: React.ElementType;
		plan: string;
	}[];
}) {
	const { isMobile } = useSidebar();
	const params = useParams({ strict: false });
	const navigate = useNavigate();
	const currentSlug = params.store;
	const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

	// Find active store based on current slug from URL
	const activeStore = React.useMemo(
		() => stores.find((store) => store.slug === currentSlug) || stores[0],
		[stores, currentSlug],
	);

	if (!activeStore || stores.length === 0) {
		return null;
	}

	const handleStoreSelect = (store: (typeof stores)[0]) => {
		// Get current pathname and replace the store slug
		const currentPath = window.location.pathname;
		const pathParts = currentPath.split("/").filter(Boolean);

		// Replace the first part (store slug) with the new slug
		if (pathParts.length > 0) {
			pathParts[0] = store.slug;
		} else {
			pathParts.push(store.slug);
		}

		const newPath = `/${pathParts.join("/")}`;
		// Navigate to the new path with the store slug
		window.location.href = newPath;
	};

	const handleCreateStoreSuccess = (newStoreSlug: string) => {
		// Navigate to the new store
		navigate({
			to: "/$store",
			params: { store: newStoreSlug },
		});
	};

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<activeStore.logo className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{activeStore.name}
									</span>
									<span className="truncate text-xs">{activeStore.plan}</span>
								</div>
								<ChevronsUpDown className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							align="start"
							side={isMobile ? "bottom" : "right"}
							sideOffset={4}
						>
							<DropdownMenuLabel className="text-muted-foreground text-xs">
								Lojas
							</DropdownMenuLabel>
							{stores.map((store, index) => (
								<DropdownMenuItem
									key={store.id || store.name}
									onClick={() => handleStoreSelect(store)}
									className="gap-2 p-2"
								>
									<div className="flex size-6 items-center justify-center rounded-md border">
										<store.logo className="size-3.5 shrink-0" />
									</div>
									{store.name}
									<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="gap-2 p-2"
								onClick={() => setIsCreateModalOpen(true)}
							>
								<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
									<Plus className="size-4" />
								</div>
								<div className="text-muted-foreground font-medium">
									Adicionar loja
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
			<StoreCreateModal
				open={isCreateModalOpen}
				onOpenChange={setIsCreateModalOpen}
				onSuccess={handleCreateStoreSuccess}
			/>
		</>
	);
}
