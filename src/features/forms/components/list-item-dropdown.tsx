import {
	IconDots,
	IconEdit,
	IconEye,
	IconEyeOff,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import type { ItemActionsConfig, ListItem } from "@/components/shared/types";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ListItemDropdownProps<T extends ListItem> {
	item: T;
	onEdit: (item: T) => void;
	onToggleHidden: (id: string) => void;
	onDelete: (item: T) => void;
	actionsConfig?: ItemActionsConfig;
}

export function ListItemDropdown<T extends ListItem>({
	item,
	onEdit,
	onToggleHidden,
	onDelete,
	actionsConfig,
}: ListItemDropdownProps<T>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<IconDots className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				{actionsConfig?.canCreateChild && actionsConfig.onCreateChild && (
					<DropdownMenuItem
						onClick={() => actionsConfig.onCreateChild?.(item.id)}
					>
						<IconPlus className="size-4 mr-2" />
						{actionsConfig.createChildLabel || "Criar item filho"}
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={() => onEdit(item)}>
					<IconEdit className="size-4 mr-2" />
					Editar
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onToggleHidden(item.id)}>
					{item.hidden ? (
						<IconEye className="size-4 mr-2" />
					) : (
						<IconEyeOff className="size-4 mr-2" />
					)}

					{item.hidden ? "Exibir na loja" : "Ocultar na loja"}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => onDelete(item)}
					className="text-destructive focus:text-destructive"
				>
					<IconTrash className="size-4 mr-2" />
					Excluir
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
