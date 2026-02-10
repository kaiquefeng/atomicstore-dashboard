import type { UseMutationResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type { CreateTagResponse } from "../adapters/create-tag.adapter";
import type { DeleteTagResponse } from "../adapters/delete-tag.adapter";
import { getTagsAdapter } from "../adapters/get-tags.adapter";
import type { NewTagRow } from "../types";

interface UseTagsMutations {
	createTag?: UseMutationResult<
		CreateTagResponse,
		Error,
		{ name: string; hidden?: boolean }
	>;
	updateTag?: UseMutationResult<
		CreateTagResponse,
		Error,
		{ id: string; name: string; hidden?: boolean }
	>;
	deleteTag?: UseMutationResult<DeleteTagResponse, Error, string>;
}

export function useTags(mutations?: UseTagsMutations) {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	const {
		data: tags = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["tags", storeSlug, currentStore?.id],
		queryFn: async () => {
			const storeId = currentStore?.id;
			const tags = await getTagsAdapter(storeId);
			return tags;
		},
		enabled: !!currentStore,
	});

	const addTag = React.useCallback(
		(name: string) => {
			if (mutations?.createTag) {
				mutations.createTag.mutate({
					name,
					hidden: false,
				});
			}
		},
		[mutations],
	);

	const updateTag = React.useCallback(
		(id: string, name: string) => {
			if (mutations?.updateTag) {
				const tag = tags.find((t) => t.id === id);
				if (tag) {
					mutations.updateTag.mutate({
						id,
						name,
						hidden: tag.hidden,
					});
				}
			}
		},
		[mutations, tags],
	);

	const toggleHidden = React.useCallback(
		(id: string) => {
			if (mutations?.updateTag) {
				const tag = tags.find((t) => t.id === id);
				if (tag) {
					mutations.updateTag.mutate({
						id,
						name: tag.name,
						hidden: !tag.hidden,
					});
				}
			}
		},
		[mutations, tags],
	);

	const deleteTag = React.useCallback(
		(id: string) => {
			if (mutations?.deleteTag) {
				mutations.deleteTag.mutate(id);
			}
		},
		[mutations],
	);

	const reorderTags = React.useCallback(
		(draggedId: string, targetIndex: number) => {
			// A ordenação é apenas local por enquanto;
			// se a API suportar ordenação, podemos adicionar um adapter/mutation depois.
			// Aqui apenas retornamos uma versão reordenada para a UI se necessário.
			// Como os dados vêm da API, mantemos a fonte da verdade lá.
			console.warn("Reordenação de tags ainda não é persistida na API.", {
				draggedId,
				targetIndex,
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
		isLoading,
		error,
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
