import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useStoreSlug } from "@/hooks/use-store-slug";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const storeSlug = useStoreSlug();

	const routeMap: Record<string, string> = {
		"": "/$store/",
		products: "/$store/products",
		categories: "/$store/categories",
		orders: "/$store/orders",
		tags: "/$store/tags",
		images: "/$store/images",
		coupons: "/$store/coupons",
		"settings/shipping": "/$store/settings/shipping",
		"settings/payment": "/$store/settings/payment",
		"settings/general": "/$store/settings/general",
		"admin/payment-methods": "/$store/admin/payment-methods",
	};

	const getRouteId = (url: string): string | undefined => {
		const cleanPath = url.startsWith("/") ? url.slice(1) : url;
		return routeMap[cleanPath];
	};

	return (
		<SidebarGroup>
			{/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
			<SidebarMenu>
				{items.map((item) => {
					if (item.items && item.items.length > 0) {
						return (
							<Collapsible
								key={item.title}
								asChild
								defaultOpen={item.isActive}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title}>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items?.map((subItem) => {
												const routeId = getRouteId(subItem.url);

												return (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild>
															{subItem.url.startsWith("/") &&
															storeSlug &&
															routeId ? (
																<Link
																	to={routeId as any}
																	params={{ store: storeSlug } as any}
																	activeProps={{
																		className:
																			"bg-sidebar-accent text-sidebar-accent-foreground",
																	}}
																>
																	<span>{subItem.title}</span>
																</Link>
															) : (
																<a href={subItem.url}>
																	<span>{subItem.title}</span>
																</a>
															)}
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												);
											})}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						);
					} else {
						const routeId = getRouteId(item.url);

						return (
							<div key={item.title}>
								{item.url.startsWith("/") && storeSlug && routeId ? (
									<Link
										to={routeId as any}
										params={{ store: storeSlug } as any}
										activeProps={{
											className:
												"bg-sidebar-accent text-sidebar-accent-foreground",
										}}
									>
										<SidebarMenuButton
											tooltip={item.title}
											className="cursor-pointer"
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</SidebarMenuButton>
									</Link>
								) : (
									<a href={item.url}>
										<SidebarMenuButton
											tooltip={item.title}
											className="cursor-pointer"
										>
											{item.icon && <item.icon />}
											<span>{item.title}</span>
										</SidebarMenuButton>
									</a>
								)}
							</div>
						);
					}
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
