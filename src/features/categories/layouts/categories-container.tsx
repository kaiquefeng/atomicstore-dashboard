"use client";

import * as React from "react";
import { ActionButtons } from "@/components/shared/action-buttons";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { HeaderSection } from "@/components/shared/header-section";
import { ListHelpLink } from "@/components/shared/list-help-link";
import { CategoryList } from "../components";
import {
	useCategories,
	useCategoryDragDrop,
	useCategoryEditing,
} from "../hooks";
import type { Category } from "../types";

export function CategoriesContainer() {
	const {
		categories,
		expandedIds,
		toggleExpanded,
		addCategory,
		updateCategory,
		toggleHidden,
		deleteCategory,
		moveCategory,
	} = useCategories();

	const [localExpandedIds, setLocalExpandedIds] = React.useState(expandedIds);

	React.useEffect(() => {
		setLocalExpandedIds(expandedIds);
	}, [expandedIds]);

	const {
		newCategoryRows,
		editingCategoryId,
		editingCategoryName,
		inputRefs,
		hasPendingEdits,
		startAddCategory,
		updateNewCategoryName,
		cancelNewCategory,
		saveNewCategory,
		startEditCategory,
		cancelEditCategory,
		saveEditCategory,
		setEditingCategoryName,
		handleSaveAll,
		handleCancelAll,
	} = useCategoryEditing(addCategory, updateCategory, setLocalExpandedIds);

	const { dragOverId, handleDragStart, handleDragOver, handleDragEnd } =
		useCategoryDragDrop({ onMoveCategory: moveCategory });

	// Delete dialog state
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
	const [categoryToDelete, setCategoryToDelete] =
		React.useState<Category | null>(null);

	const openDeleteDialog = React.useCallback((category: Category) => {
		setCategoryToDelete(category);
		setIsDeleteDialogOpen(true);
	}, []);

	const handleConfirmDelete = React.useCallback(() => {
		if (categoryToDelete) {
			deleteCategory(categoryToDelete.id);
			setCategoryToDelete(null);
			setIsDeleteDialogOpen(false);
		}
	}, [categoryToDelete, deleteCategory]);

	const handleCreateCategory = React.useCallback(() => {
		startAddCategory(null);
	}, [startAddCategory]);

	const getWarningMessage = () => {
		if (categoryToDelete?.children && categoryToDelete.children.length > 0) {
			return `Atenção: Esta categoria possui ${categoryToDelete.children.length} subcategoria(s) que também serão eliminadas.`;
		}
		return undefined;
	};

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			<HeaderSection
				title="Categorias"
				description="Para organizar seus produtos, crie categorias e subcategorias que aparecerão no menu da loja."
				buttonLabel="Criar categoria"
				onButtonClick={handleCreateCategory}
			/>

			<CategoryList
				categories={categories}
				expandedIds={localExpandedIds}
				editingCategoryId={editingCategoryId}
				editingCategoryName={editingCategoryName}
				dragOverId={dragOverId}
				inputRefs={inputRefs}
				newCategoryRows={newCategoryRows}
				onToggleExpanded={toggleExpanded}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				onSetEditingCategoryName={setEditingCategoryName}
				onSaveEditCategory={saveEditCategory}
				onCancelEditCategory={cancelEditCategory}
				onToggleHidden={toggleHidden}
				onStartAddCategory={startAddCategory}
				onStartEditCategory={startEditCategory}
				onOpenDeleteDialog={openDeleteDialog}
				onUpdateNewCategoryName={updateNewCategoryName}
				onCancelNewCategory={cancelNewCategory}
				onSaveNewCategory={saveNewCategory}
			/>

			<ActionButtons
				hasPendingEdits={hasPendingEdits}
				onSaveAll={handleSaveAll}
				onCancelAll={handleCancelAll}
			/>

			<ListHelpLink label="Mais sobre criar e organizar as categorias" />

			<DeleteDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				title="Eliminar categoria"
				itemName={categoryToDelete?.name || undefined}
				warningMessage={getWarningMessage()}
				onConfirmDelete={handleConfirmDelete}
			/>
		</div>
	);
}
