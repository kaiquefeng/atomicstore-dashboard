"use client";

import * as React from "react";
import { ActionButtons } from "@/components/shared/action-buttons";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { HeaderSection } from "@/components/shared/header-section";
import { ListHelpLink } from "@/components/shared/list-help-link";
import { TagList } from "../components";
import {
	useCreateTag,
	useDeleteTag,
	useTagDragDrop,
	useTagEditing,
	useTags,
	useUpdateTag,
} from "../hooks";
import type { Tag } from "../types";

export function TagsContainer() {
	const createTagMutation = useCreateTag();
	const updateTagMutation = useUpdateTag();
	const deleteTagMutation = useDeleteTag();

	const { tags, addTag, updateTag, toggleHidden, deleteTag, reorderTags } =
		useTags({
			createTag: createTagMutation,
			updateTag: updateTagMutation,
			deleteTag: deleteTagMutation,
		});

	const {
		newTagRows,
		editingTagId,
		editingTagName,
		inputRefs,
		hasPendingEdits,
		startAddTag,
		updateNewTagName,
		cancelNewTag,
		saveNewTag,
		startEditTag,
		cancelEditTag,
		saveEditTag,
		setEditingTagName,
		handleSaveAll,
		handleCancelAll,
	} = useTagEditing(addTag, updateTag);

	const { dragOverIndex, handleDragStart, handleDragOver, handleDragEnd } =
		useTagDragDrop({ onReorderTag: reorderTags });

	// Delete dialog state
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
	const [tagToDelete, setTagToDelete] = React.useState<Tag | null>(null);

	const openDeleteDialog = React.useCallback((tag: Tag) => {
		setTagToDelete(tag);
		setIsDeleteDialogOpen(true);
	}, []);

	const handleConfirmDelete = React.useCallback(() => {
		if (tagToDelete) {
			deleteTag(tagToDelete.id);
			setTagToDelete(null);
			setIsDeleteDialogOpen(false);
		}
	}, [tagToDelete, deleteTag]);

	const handleCreateTag = React.useCallback(() => {
		startAddTag();
	}, [startAddTag]);

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			<HeaderSection
				title="Tags"
				description="Crie tags para identificar e filtrar seus produtos na loja."
				buttonLabel="Criar tag"
				onButtonClick={handleCreateTag}
			/>

			<TagList
				tags={tags}
				editingTagId={editingTagId}
				editingTagName={editingTagName}
				dragOverIndex={dragOverIndex}
				inputRefs={inputRefs}
				newTagRows={newTagRows}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				onSetEditingTagName={setEditingTagName}
				onSaveEditTag={saveEditTag}
				onCancelEditTag={cancelEditTag}
				onToggleHidden={toggleHidden}
				onStartAddTag={startAddTag}
				onStartEditTag={startEditTag}
				onOpenDeleteDialog={openDeleteDialog}
				onUpdateNewTagName={updateNewTagName}
				onCancelNewTag={cancelNewTag}
				onSaveNewTag={saveNewTag}
			/>

			<ActionButtons
				hasPendingEdits={hasPendingEdits}
				onSaveAll={handleSaveAll}
				onCancelAll={handleCancelAll}
			/>

			<ListHelpLink label="Mais sobre criar e utilizar tags" />

			<DeleteDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				title="Eliminar tag"
				itemName={tagToDelete?.name}
				warningMessage="Esta ação removerá a tag de todos os produtos associados."
				onConfirmDelete={handleConfirmDelete}
			/>
		</div>
	);
}
