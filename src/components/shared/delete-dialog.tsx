import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface DeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	itemName: string | undefined;
	description?: string;
	warningMessage?: string;
	onConfirmDelete: () => void;
}

export function DeleteDialog({
	open,
	onOpenChange,
	title,
	itemName,
	description,
	warningMessage,
	onConfirmDelete,
}: DeleteDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{description || `Tem certeza que deseja excluir "${itemName}"?`}
						{warningMessage && (
							<span className="block mt-2 text-destructive">
								{warningMessage}
							</span>
						)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button variant="destructive" onClick={onConfirmDelete}>
						Eliminar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
