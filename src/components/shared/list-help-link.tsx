import { IconHelp } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface ListHelpLinkProps {
	label: string;
	onHelpClick?: () => void;
}

export function ListHelpLink({ label, onHelpClick }: ListHelpLinkProps) {
	return (
		<div className="flex items-center justify-center gap-2 text-sm">
			<IconHelp className="size-5 text-muted-foreground" />
			<Button
				variant="link"
				className="text-primary p-0 h-auto flex items-center gap-1"
				onClick={onHelpClick}
			>
				{label}
				<span className="text-xs">↗</span>
			</Button>
		</div>
	);
}
