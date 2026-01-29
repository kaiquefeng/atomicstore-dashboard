import { IconGripVertical } from "@tabler/icons-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { ListItemDropdown } from "@/features/forms/components/list-item-dropdown";
import { ListItemEditActions } from "@/features/forms/components/list-item-edit-actions";
import type { Tag } from "../types";

interface TagItemProps {
	tag: Tag;
	index: number;
	editingTagId: string | null;
	editingTagName: string;
	dragOverIndex: number | null;
	inputRefs: React.MutableRefObject<Map<string, HTMLInputElement>>;
	onDragStart: (id: string) => void;
	onDragOver: (e: React.DragEvent, index: number) => void;
	onDragEnd: () => void;
	onSetEditingTagName: (name: string) => void;
	onSaveEditTag: () => void;
	onCancelEditTag: () => void;
	onToggleHidden: (id: string) => void;
	onStartEditTag: (tag: Tag) => void;
	onOpenDeleteDialog: (tag: Tag) => void;
}

export function TagItem({
	tag,
	index,
	editingTagId,
	editingTagName,
	dragOverIndex,
	inputRefs,
	onDragStart,
	onDragOver,
	onDragEnd,
	onSetEditingTagName,
	onSaveEditTag,
	onCancelEditTag,
	onToggleHidden,
	onStartEditTag,
	onOpenDeleteDialog,
}: TagItemProps) {
	const isDragOver = dragOverIndex === index;
	const isEditing = editingTagId === tag.id;

	const handleDragStartInternal = React.useCallback(() => {
		onDragStart(tag.id);
	}, [tag.id, onDragStart]);

	const handleDragOverInternal = React.useCallback(
		(e: React.DragEvent) => {
			onDragOver(e, index);
		},
		[index, onDragOver],
	);

	return (
		<article
			draggable={!isEditing}
			onDragStart={handleDragStartInternal}
			onDragOver={handleDragOverInternal}
			onDragEnd={onDragEnd}
			className={`flex items-center gap-2 py-3 px-4 border-b transition-colors ${
				isDragOver
					? "bg-primary/10 border-primary"
					: isEditing
						? "bg-muted/30"
						: "bg-background hover:bg-muted/50"
			} ${tag.hidden ? "opacity-50" : ""}`}
		>
			{/* Drag Handle */}
			<div
				className={`cursor-grab text-muted-foreground hover:text-foreground ${isEditing ? "cursor-default" : ""}`}
			>
				<IconGripVertical className="size-5" />
			</div>

			{/* Tag Name or Input */}
			{isEditing ? (
				<Input
					ref={(el) => {
						if (el) inputRefs.current.set(tag.id, el);
					}}
					value={editingTagName}
					onChange={(e) => onSetEditingTagName(e.target.value)}
					className="flex-1 h-9"
					onKeyDown={(e) => {
						if (e.key === "Enter" && editingTagName.trim()) {
							onSaveEditTag();
						} else if (e.key === "Escape") {
							onCancelEditTag();
						}
					}}
				/>
			) : (
				<span className="flex-1 font-medium">{tag.name}</span>
			)}

			{/* Hidden Indicator */}
			{tag.hidden && !isEditing && (
				<span className="text-muted-foreground text-xs">(oculto)</span>
			)}

			{/* Action Buttons */}
			{isEditing ? (
				<ListItemEditActions
					item={tag}
					onToggleHidden={onToggleHidden}
					onSaveEdit={onSaveEditTag}
					onCancelEdit={onCancelEditTag}
					onDelete={onOpenDeleteDialog}
				/>
			) : (
				<ListItemDropdown
					item={tag}
					onEdit={onStartEditTag}
					onToggleHidden={onToggleHidden}
					onDelete={onOpenDeleteDialog}
				/>
			)}
		</article>
	);
}
