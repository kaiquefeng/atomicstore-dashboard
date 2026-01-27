import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/data-table";
import data from "@/constants/products-table-data.json";

export const Route = createFileRoute("/$store/_layout/products")({
	component: RouteComponent,
});

function RouteComponent() {
	return <DataTable data={data} />;
}
