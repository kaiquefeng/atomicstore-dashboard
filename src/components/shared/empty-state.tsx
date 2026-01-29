import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
	title: string;
	description: string;
	buttonLabel: string;
	onButtonClick: () => void;
}

export function EmptyState({
	title,
	description,
	buttonLabel,
	onButtonClick,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
				<IconPlus className="size-8 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-medium mb-2">{title}</h3>
			<p className="text-muted-foreground text-sm max-w-sm mb-4">
				{description}
			</p>
			<Button onClick={onButtonClick}>
				<IconPlus className="size-4 mr-2" />
				{buttonLabel}
			</Button>
		</div>
	);
}
