import type * as React from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { ListInputRow } from "@/features/forms/components/list-input-row";
import type { NewTagRow, Tag } from "../types";
import { TagItem } from "./tag-item";

interface TagListProps {
	tags: Tag[];
	editingTagId: string | null;
	editingTagName: string;
	dragOverIndex: number | null;
	inputRefs: React.MutableRefObject<Map<string, HTMLInputElement>>;
	newTagRows: NewTagRow[];
	onDragStart: (id: string) => void;
	onDragOver: (e: React.DragEvent, index: number) => void;
	onDragEnd: () => void;
	onSetEditingTagName: (name: string) => void;
	onSaveEditTag: () => void;
	onCancelEditTag: () => void;
	onToggleHidden: (id: string) => void;
	onStartAddTag: () => void;
	onStartEditTag: (tag: Tag) => void;
	onOpenDeleteDialog: (tag: Tag) => void;
	onUpdateNewTagName: (tempId: string, name: string) => void;
	onCancelNewTag: (tempId: string) => void;
	onSaveNewTag: (tempId: string) => void;
}

export function TagList({
	tags,
	editingTagId,
	editingTagName,
	dragOverIndex,
	inputRefs,
	newTagRows,
	onDragStart,
	onDragOver,
	onDragEnd,
	onSetEditingTagName,
	onSaveEditTag,
	onCancelEditTag,
	onToggleHidden,
	onStartAddTag,
	onStartEditTag,
	onOpenDeleteDialog,
	onUpdateNewTagName,
	onCancelNewTag,
	onSaveNewTag,
}: TagListProps) {
	return (
		<Card>
			<CardContent className="p-0">
				{tags.length === 0 && newTagRows.length === 0 ? (
					<EmptyState
						title="Nenhuma tag criada"
						description="Crie tags para identificar e filtrar seus produtos na loja."
						buttonLabel="Criar primeira tag"
						onButtonClick={onStartAddTag}
					/>
				) : (
					<div className="divide-y-0">
						{tags.map((tag, index) => (
							<TagItem
								key={tag.id}
								tag={tag}
								index={index}
								editingTagId={editingTagId}
								editingTagName={editingTagName}
								dragOverIndex={dragOverIndex}
								inputRefs={inputRefs}
								onDragStart={onDragStart}
								onDragOver={onDragOver}
								onDragEnd={onDragEnd}
								onSetEditingTagName={onSetEditingTagName}
								onSaveEditTag={onSaveEditTag}
								onCancelEditTag={onCancelEditTag}
								onToggleHidden={onToggleHidden}
								onStartEditTag={onStartEditTag}
								onOpenDeleteDialog={onOpenDeleteDialog}
							/>
						))}

						{newTagRows.map((row) => (
							<ListInputRow
								key={row.tempId}
								row={row}
								placeholder="Nome da tag"
								inputRefs={inputRefs}
								onUpdateName={onUpdateNewTagName}
								onCancel={onCancelNewTag}
								onSave={onSaveNewTag}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
