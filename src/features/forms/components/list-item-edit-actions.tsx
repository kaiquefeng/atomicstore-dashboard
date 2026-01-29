import { IconEyeOff, IconListTree, IconTrash } from "@tabler/icons-react";
import type { ItemActionsConfig, ListItem } from "@/components/shared/types";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ListItemEditActionsProps<T extends ListItem> {
	item: T;
	onToggleHidden: (id: string) => void;
	onSaveEdit: () => void;
	onCancelEdit: () => void;
	onDelete: (item: T) => void;
	actionsConfig?: ItemActionsConfig;
}

export function ListItemEditActions<T extends ListItem>({
	item,
	onToggleHidden,
	onSaveEdit,
	onCancelEdit,
	onDelete,
	actionsConfig,
}: ListItemEditActionsProps<T>) {
	return (
		<div className="flex items-center gap-1">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-9 rounded-full text-muted-foreground"
							onClick={() => onToggleHidden(item.id)}
						>
							<IconEyeOff className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						{item.hidden ? "Mostrar na loja" : "Ocultar na loja"}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			{actionsConfig?.canCreateChild && actionsConfig.onCreateChild && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
								onClick={() => {
									onSaveEdit();
									actionsConfig.onCreateChild?.(item.id);
								}}
							>
								<IconListTree className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{actionsConfig.createChildLabel || "Criar item filho"}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-9 rounded-full text-muted-foreground hover:text-destructive"
							onClick={() => {
								onCancelEdit();
								onDelete(item);
							}}
						>
							<IconTrash className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Excluir</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
