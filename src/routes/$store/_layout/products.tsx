"use client";

import { IconLoader } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";
import { useProducts } from "@/features/products/hooks/use-products";

export const Route = createFileRoute("/$store/_layout/products")({
	component: RouteComponent,
});

function RouteComponent() {
	const { products, isLoading, error } = useProducts();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<IconLoader className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<p className="text-destructive font-medium">
						Erro ao carregar produtos
					</p>
					<p className="text-sm text-muted-foreground mt-1">
						{error instanceof Error
							? error.message
							: "Tente novamente mais tarde."}
					</p>
				</div>
			</div>
		);
	}

	return <DataTable data={products} />;
}
