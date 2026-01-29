import { createFileRoute } from "@tanstack/react-router";
import { TagsContainer } from "@/features/tags";

export const Route = createFileRoute("/$store/_layout/tags")({
	component: TagsPage,
});

function TagsPage() {
	return <TagsContainer />;
}
