import {
	IconChevronDown,
	IconChevronRight,
	IconGripVertical,
} from "@tabler/icons-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { ListInputRow } from "@/features/forms/components/list-input-row";
import { ListItemDropdown } from "@/features/forms/components/list-item-dropdown";
import { ListItemEditActions } from "@/features/forms/components/list-item-edit-actions";
import type { Category, NewCategoryRow } from "../types";

interface CategoryItemProps {
	category: Category;
	depth?: number;
	expandedIds: Set<string>;
	editingCategoryId: string | null;
	editingCategoryName: string;
	dragOverId: string | null;
	inputRefs: React.MutableRefObject<Map<string, HTMLInputElement>>;
	newCategoryRows: NewCategoryRow[];
	onToggleExpanded: (id: string) => void;
	onDragStart: (id: string) => void;
	onDragOver: (e: React.DragEvent, id: string) => void;
	onDragEnd: () => void;
	onSetEditingCategoryName: (name: string) => void;
	onSaveEditCategory: () => void;
	onCancelEditCategory: () => void;
	onToggleHidden: (id: string) => void;
	onStartAddCategory: (parentId: string | null) => void;
	onStartEditCategory: (category: Category) => void;
	onOpenDeleteDialog: (category: Category) => void;
	onUpdateNewCategoryName: (tempId: string, name: string) => void;
	onCancelNewCategory: (tempId: string) => void;
	onSaveNewCategory: (tempId: string) => void;
}

export function CategoryItem({
	category,
	depth = 0,
	expandedIds,
	editingCategoryId,
	editingCategoryName,
	dragOverId,
	inputRefs,
	newCategoryRows,
	onToggleExpanded,
	onDragStart,
	onDragOver,
	onDragEnd,
	onSetEditingCategoryName,
	onSaveEditCategory,
	onCancelEditCategory,
	onToggleHidden,
	onStartAddCategory,
	onStartEditCategory,
	onOpenDeleteDialog,
	onUpdateNewCategoryName,
	onCancelNewCategory,
	onSaveNewCategory,
}: CategoryItemProps) {
	const hasChildren = category.children.length > 0;
	const isExpanded = expandedIds.has(category.id);
	const isDragOver = dragOverId === category.id;
	const isEditing = editingCategoryId === category.id;
	const childNewRows = newCategoryRows.filter(
		(row) => row.parentId === category.id,
	);

	const handleDragStartInternal = React.useCallback(() => {
		onDragStart(category.id);
	}, [category.id, onDragStart]);

	const handleDragOverInternal = React.useCallback(
		(e: React.DragEvent) => {
			onDragOver(e, category.id);
		},
		[category.id, onDragOver],
	);

	return (
		<div>
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
				} ${!category.isActive ? "opacity-50" : ""}`}
				style={{ paddingLeft: `${depth * 32 + 16}px` }}
			>
				{/* Drag Handle */}
				<div
					className={`cursor-grab text-muted-foreground hover:text-foreground ${isEditing ? "cursor-default" : ""}`}
				>
					<IconGripVertical className="size-5" />
				</div>

				{/* Expand/Collapse Button */}
				{hasChildren || childNewRows.length > 0 ? (
					<button
						type="button"
						onClick={() => onToggleExpanded(category.id)}
						className="text-muted-foreground hover:text-foreground"
					>
						{isExpanded ? (
							<IconChevronDown className="size-5" />
						) : (
							<IconChevronRight className="size-5" />
						)}
					</button>
				) : (
					<div className="w-5" />
				)}

				{/* Category Name or Input */}
				{isEditing ? (
					<Input
						ref={(el) => {
							if (el) inputRefs.current.set(category.id, el);
						}}
						value={editingCategoryName}
						onChange={(e) => onSetEditingCategoryName(e.target.value)}
						className="flex-1 h-9"
						onKeyDown={(e) => {
							if (e.key === "Enter" && editingCategoryName.trim()) {
								onSaveEditCategory();
							} else if (e.key === "Escape") {
								onCancelEditCategory();
							}
						}}
					/>
				) : (
					<span className="flex-1 font-medium">{category.name}</span>
				)}

				{!category.isActive && !isEditing && (
					<span className="text-muted-foreground text-xs">(oculto)</span>
				)}

				{/* Action Buttons */}
				{isEditing ? (
					<ListItemEditActions
						item={category}
						onToggleHidden={onToggleHidden}
						onSaveEdit={onSaveEditCategory}
						onCancelEdit={onCancelEditCategory}
						onDelete={onOpenDeleteDialog}
						actionsConfig={{
							canCreateChild: true,
							onCreateChild: onStartAddCategory,
							createChildLabel: "Criar subcategoria",
						}}
					/>
				) : (
					<ListItemDropdown
						item={category}
						onEdit={onStartEditCategory}
						onToggleHidden={onToggleHidden}
						onDelete={onOpenDeleteDialog}
						actionsConfig={{
							canCreateChild: true,
							onCreateChild: onStartAddCategory,
							createChildLabel: "Criar subcategoria",
						}}
					/>
				)}
			</article>

			{/* Children */}
			{(hasChildren || childNewRows.length > 0) && isExpanded && (
				<ul className="list-none m-0 p-0">
					{category.children.map((child) => (
						<CategoryItem
							key={child.id}
							category={child}
							depth={depth + 1}
							expandedIds={expandedIds}
							editingCategoryId={editingCategoryId}
							editingCategoryName={editingCategoryName}
							dragOverId={dragOverId}
							inputRefs={inputRefs}
							newCategoryRows={newCategoryRows}
							onToggleExpanded={onToggleExpanded}
							onDragStart={onDragStart}
							onDragOver={onDragOver}
							onDragEnd={onDragEnd}
							onSetEditingCategoryName={onSetEditingCategoryName}
							onSaveEditCategory={onSaveEditCategory}
							onCancelEditCategory={onCancelEditCategory}
							onToggleHidden={onToggleHidden}
							onStartAddCategory={onStartAddCategory}
							onStartEditCategory={onStartEditCategory}
							onOpenDeleteDialog={onOpenDeleteDialog}
							onUpdateNewCategoryName={onUpdateNewCategoryName}
							onCancelNewCategory={onCancelNewCategory}
							onSaveNewCategory={onSaveNewCategory}
						/>
					))}
					{childNewRows.map((row) => (
						<ListInputRow
							key={row.tempId}
							row={row}
							depth={depth + 1}
							placeholder="Nome da categoria"
							inputRefs={inputRefs}
							onUpdateName={onUpdateNewCategoryName}
							onCancel={onCancelNewCategory}
							onSave={onSaveNewCategory}
						/>
					))}
				</ul>
			)}
		</div>
	);
}
