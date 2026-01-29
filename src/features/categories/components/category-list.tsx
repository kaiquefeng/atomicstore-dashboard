import type * as React from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { ListInputRow } from "@/features/forms/components/list-input-row";
import type { Category, NewCategoryRow } from "../types";
import { CategoryItem } from "./category-item";

interface CategoryListProps {
	categories: Category[];
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

export function CategoryList({
	categories,
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
}: CategoryListProps) {
	const rootNewRows = newCategoryRows.filter((row) => row.parentId === null);

	return (
		<Card>
			<CardContent className="p-0">
				{categories.length === 0 && rootNewRows.length === 0 ? (
					<EmptyState
						title="Nenhuma categoria criada"
						description="Crie categorias para organizar seus produtos e facilitar a navegação na sua loja."
						buttonLabel="Criar primeira categoria"
						onButtonClick={() => onStartAddCategory(null)}
					/>
				) : (
					<div className="divide-y-0">
						{categories.map((category) => (
							<CategoryItem
								key={category.id}
								category={category}
								depth={0}
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

						{rootNewRows.map((row) => (
							<ListInputRow
								key={row.tempId}
								row={row}
								placeholder="Nome da categoria"
								inputRefs={inputRefs}
								onUpdateName={onUpdateNewCategoryName}
								onCancel={onCancelNewCategory}
								onSave={onSaveNewCategory}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
