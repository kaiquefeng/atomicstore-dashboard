import { createFileRoute } from "@tanstack/react-router";
import { CategoriesContainer } from "@/features/categories";

export const Route = createFileRoute("/$store/_layout/categories")({
	component: CategoriesPage,
});

function CategoriesPage() {
	return <CategoriesContainer />;
}
