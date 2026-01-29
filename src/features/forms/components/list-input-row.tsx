import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import type * as React from "react";
import type { NewItemRow } from "@/components/shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ListInputRowProps {
	row: NewItemRow;
	depth?: number;
	placeholder?: string;
	inputRefs: React.MutableRefObject<Map<string, HTMLInputElement>>;
	onUpdateName: (tempId: string, name: string) => void;
	onCancel: (tempId: string) => void;
	onSave: (tempId: string) => void;
}

export function ListInputRow({
	row,
	depth = 0,
	placeholder = "Nome do item",
	inputRefs,
	onUpdateName,
	onCancel,
	onSave,
}: ListInputRowProps) {
	return (
		<div
			className="flex items-center gap-2 py-3 px-4 border-b bg-muted/30"
			style={{ paddingLeft: `${depth * 32 + 16}px` }}
		>
			{/* Drag Handle (disabled for new row) */}
			<div className="text-muted-foreground/40">
				<IconGripVertical className="size-5" />
			</div>

			{/* Spacer for expand/collapse (if depth > 0 or has hierarchy) */}
			{depth > 0 && <div className="w-5" />}

			{/* Input */}
			<Input
				ref={(el) => {
					if (el) inputRefs.current.set(row.tempId, el);
				}}
				value={row.name}
				onChange={(e) => onUpdateName(row.tempId, e.target.value)}
				placeholder={placeholder}
				className="flex-1 h-9"
				onKeyDown={(e) => {
					if (e.key === "Enter" && row.name.trim()) {
						onSave(row.tempId);
					} else if (e.key === "Escape") {
						onCancel(row.tempId);
					}
				}}
			/>

			{/* Action Buttons */}
			<div className="flex items-center gap-1">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-9 rounded-full text-muted-foreground hover:text-destructive"
								onClick={() => onCancel(row.tempId)}
							>
								<IconTrash className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Remover</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
