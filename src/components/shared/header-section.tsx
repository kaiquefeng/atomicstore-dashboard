import { Button } from "@/components/ui/button";

interface HeaderSectionProps {
	title: string;
	description: string;
	buttonLabel: string;
	onButtonClick: () => void;
}

export function HeaderSection({
	title,
	description,
	buttonLabel,
	onButtonClick,
}: HeaderSectionProps) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
				<p className="text-muted-foreground mt-1">{description}</p>
			</div>
			<Button onClick={onButtonClick}>{buttonLabel}</Button>
		</div>
	);
}
