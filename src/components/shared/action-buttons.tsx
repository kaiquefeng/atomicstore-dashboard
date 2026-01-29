import { Button } from "@/components/ui/button";

interface ActionsButtonsProps {
	hasPendingEdits: boolean;
	onSaveAll: () => void;
	onCancelAll: () => void;
	saveLabel?: string;
	cancelLabel?: string;
}

export function ActionButtons({
	hasPendingEdits,
	onSaveAll,
	onCancelAll,
	saveLabel = "Salvar",
	cancelLabel = "Cancelar",
}: ActionsButtonsProps) {
	if (!hasPendingEdits) return null;

	return (
		<div className="flex items-center justify-end gap-3">
			<Button variant="outline" onClick={onCancelAll}>
				{cancelLabel}
			</Button>
			<Button onClick={onSaveAll}>{saveLabel}</Button>
		</div>
	);
}
