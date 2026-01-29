import * as React from "react";
import { generateSlug } from "@/helpers/generate";
import type { NewTagRow, Tag } from "../types";

const INITIAL_TAGS: Tag[] = [
	{
		id: "1",
		name: "Promoção",
		slug: "promocao",
		hidden: false,
	},
	{
		id: "2",
		name: "Novo",
		slug: "novo",
		hidden: false,
	},
	{
		id: "3",
		name: "Destaque",
		slug: "destaque",
		hidden: false,
	},
	{
		id: "4",
		name: "Esgotando",
		slug: "esgotando",
		hidden: false,
	},
];

export function useTags() {
	const [tags, setTags] = React.useState<Tag[]>(INITIAL_TAGS);

	const addTag = React.useCallback((name: string) => {
		const newTag: Tag = {
			id: `${Date.now()}`,
			name,
			slug: generateSlug(name),
			hidden: false,
		};

		setTags((prev) => [...prev, newTag]);
	}, []);

	const updateTag = React.useCallback((id: string, name: string) => {
		setTags((prev) =>
			prev.map((tag) =>
				tag.id === id ? { ...tag, name, slug: generateSlug(name) } : tag,
			),
		);
	}, []);

	const toggleHidden = React.useCallback((id: string) => {
		setTags((prev) =>
			prev.map((tag) =>
				tag.id === id ? { ...tag, hidden: !tag.hidden } : tag,
			),
		);
	}, []);

	const deleteTag = React.useCallback((id: string) => {
		setTags((prev) => prev.filter((tag) => tag.id !== id));
	}, []);

	const reorderTags = React.useCallback(
		(draggedId: string, targetIndex: number) => {
			setTags((prev) => {
				const draggedIndex = prev.findIndex((t) => t.id === draggedId);
				if (draggedIndex === -1) return prev;

				const newTags = [...prev];
				const [draggedTag] = newTags.splice(draggedIndex, 1);
				newTags.splice(targetIndex, 0, draggedTag);
				return newTags;
			});
		},
		[],
	);

	return {
		tags,
		addTag,
		updateTag,
		toggleHidden,
		deleteTag,
		reorderTags,
	};
}

export function useTagEditing(
	addTag: (name: string) => void,
	updateTag: (id: string, name: string) => void,
) {
	const [newTagRows, setNewTagRows] = React.useState<NewTagRow[]>([]);
	const [editingTagId, setEditingTagId] = React.useState<string | null>(null);
	const [editingTagName, setEditingTagName] = React.useState<string>("");

	const inputRefs = React.useRef<Map<string, HTMLInputElement>>(new Map());

	const startAddTag = React.useCallback(() => {
		const tempId = `new-${Date.now()}`;
		setNewTagRows((prev) => [...prev, { name: "", tempId, slug: "" }]);

		setTimeout(() => {
			inputRefs.current.get(tempId)?.focus();
		}, 50);
	}, []);

	const updateNewTagName = React.useCallback((tempId: string, name: string) => {
		setNewTagRows((prev) =>
			prev.map((row) => (row.tempId === tempId ? { ...row, name } : row)),
		);
	}, []);

	const cancelNewTag = React.useCallback((tempId: string) => {
		setNewTagRows((prev) => prev.filter((row) => row.tempId !== tempId));
	}, []);

	const saveNewTag = React.useCallback(
		(tempId: string) => {
			const row = newTagRows.find((r) => r.tempId === tempId);
			if (row?.name.trim()) {
				addTag(row.name.trim());
				setNewTagRows((prev) => prev.filter((r) => r.tempId !== tempId));
			}
		},
		[newTagRows, addTag],
	);

	const startEditTag = React.useCallback(
		(tag: { id: string; name: string }) => {
			setEditingTagId(tag.id);
			setEditingTagName(tag.name);

			setTimeout(() => {
				inputRefs.current.get(tag.id)?.focus();
			}, 50);
		},
		[],
	);

	const cancelEditTag = React.useCallback(() => {
		setEditingTagId(null);
		setEditingTagName("");
	}, []);

	const saveEditTag = React.useCallback(() => {
		if (editingTagId && editingTagName.trim()) {
			updateTag(editingTagId, editingTagName.trim());
			setEditingTagId(null);
			setEditingTagName("");
		}
	}, [editingTagId, editingTagName, updateTag]);

	const hasPendingEdits = newTagRows.length > 0 || editingTagId !== null;

	const handleSaveAll = React.useCallback(() => {
		for (const row of newTagRows) {
			if (row.name.trim()) {
				addTag(row.name.trim());
			}
		}
		setNewTagRows([]);

		if (editingTagId && editingTagName.trim()) {
			updateTag(editingTagId, editingTagName.trim());
			setEditingTagId(null);
			setEditingTagName("");
		}
	}, [newTagRows, editingTagId, editingTagName, addTag, updateTag]);

	const handleCancelAll = React.useCallback(() => {
		setNewTagRows([]);
		setEditingTagId(null);
		setEditingTagName("");
	}, []);

	return {
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
	};
}
