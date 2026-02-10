"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type { CreateCategoryResponse } from "../adapters/create-category.adapter";
import type { DeleteCategoryResponse } from "../adapters/delete-category.adapter";
import { getCategoriesAdapter } from "../adapters/get-categories.adapter";
import type { Category, NewCategoryRow } from "../types";

interface UseCategoriesMutations {
	createCategory?: UseMutationResult<
		CreateCategoryResponse,
		Error,
		{ name: string; parentId: string | null; hidden?: boolean }
	>;
	updateCategory?: UseMutationResult<
		CreateCategoryResponse,
		Error,
		{ id: string; name: string; parentId?: string | null; hidden?: boolean }
	>;
	deleteCategory?: UseMutationResult<DeleteCategoryResponse, Error, string>;
}

export function useCategories(mutations?: UseCategoriesMutations) {
	const storeSlug = useStoreSlug();
	const { stores } = useStores();
	const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

	// Obter storeId a partir do slug
	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	const {
		data: categories = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["categories", storeSlug, currentStore?.id],
		queryFn: async () => {
			const storeId = currentStore?.id;
			const categories = await getCategoriesAdapter(storeId);
			return categories;
		},
		enabled: !!currentStore,
	});

	const toggleExpanded = React.useCallback((id: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	const findCategoryById = React.useCallback(
		(cats: Category[], id: string): Category | undefined => {
			for (const cat of cats) {
				if (cat.id === id) return cat;
				const found = findCategoryById(cat.children, id);
				if (found) return found;
			}
			return undefined;
		},
		[],
	);

	const addCategory = React.useCallback(
		(parentId: string | null, name: string) => {
			if (mutations?.createCategory) {
				// Usar mutation da API
				mutations.createCategory.mutate({
					name,
					parentId,
					hidden: false,
				});
				// Expandir parent se for subcategoria
				if (parentId) {
					setExpandedIds((prev) => new Set([...prev, parentId]));
				}
			}
		},
		[mutations],
	);

	const updateCategory = React.useCallback(
		(id: string, name: string) => {
			if (mutations?.updateCategory) {
				const category = findCategoryById(categories, id);
				if (category) {
					// Usar mutation da API
					mutations.updateCategory.mutate({
						id,
						name,
						parentId: category.parentId,
						hidden: !category.isActive,
					});
				}
			}
		},
		[mutations, categories, findCategoryById],
	);

	const toggleHidden = React.useCallback(
		(id: string) => {
			if (mutations?.updateCategory) {
				const category = findCategoryById(categories, id);
				if (category) {
					mutations.updateCategory.mutate({
						id,
						name: category.name,
						parentId: category.parentId,
						hidden: category.isActive,
					});
				}
			}
		},
		[mutations, categories, findCategoryById],
	);

	const deleteCategory = React.useCallback(
		(id: string) => {
			if (mutations?.deleteCategory) {
				// Usar mutation da API
				mutations.deleteCategory.mutate(id);
			}
		},
		[mutations],
	);

	const moveCategory = React.useCallback(
		(draggedId: string, targetId: string) => {
			if (mutations?.updateCategory) {
				const draggedCategory = findCategoryById(categories, draggedId);
				if (draggedCategory) {
					// Atualizar parentId via API
					mutations.updateCategory.mutate({
						id: draggedId,
						name: draggedCategory.name,
						parentId: targetId,
						hidden: !draggedCategory.isActive,
					});
					setExpandedIds((prev) => new Set([...prev, targetId]));
				}
			}
		},
		[mutations, categories, findCategoryById],
	);

	return {
		categories,
		expandedIds,
		toggleExpanded,
		addCategory,
		updateCategory,
		toggleHidden,
		deleteCategory,
		moveCategory,
		findCategoryById,
		isLoading,
		error,
	};
}

export function useCategoryEditing(
	addCategory: (parentId: string | null, name: string) => void,
	updateCategory: (id: string, name: string) => void,
	setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>,
) {
	const [newCategoryRows, setNewCategoryRows] = React.useState<
		NewCategoryRow[]
	>([]);
	const [editingCategoryId, setEditingCategoryId] = React.useState<
		string | null
	>(null);
	const [editingCategoryName, setEditingCategoryName] =
		React.useState<string>("");

	const inputRefs = React.useRef<Map<string, HTMLInputElement>>(new Map());

	const startAddCategory = React.useCallback(
		(parentId: string | null = null) => {
			const tempId = `new-${Date.now()}`;
			setNewCategoryRows((prev) => [...prev, { parentId, name: "", tempId }]);

			if (parentId) {
				setExpandedIds((prev) => new Set([...prev, parentId]));
			}

			setTimeout(() => {
				inputRefs.current.get(tempId)?.focus();
			}, 50);
		},
		[setExpandedIds],
	);

	const updateNewCategoryName = React.useCallback(
		(tempId: string, name: string) => {
			setNewCategoryRows((prev) =>
				prev.map((row) => (row.tempId === tempId ? { ...row, name } : row)),
			);
		},
		[],
	);

	const cancelNewCategory = React.useCallback((tempId: string) => {
		setNewCategoryRows((prev) => prev.filter((row) => row.tempId !== tempId));
	}, []);

	const saveNewCategory = React.useCallback(
		(tempId: string) => {
			const row = newCategoryRows.find((r) => r.tempId === tempId);
			if (row?.name.trim()) {
				addCategory(row.parentId, row.name.trim());
				setNewCategoryRows((prev) => prev.filter((r) => r.tempId !== tempId));
			}
		},
		[newCategoryRows, addCategory],
	);

	const startEditCategory = React.useCallback(
		(category: { id: string; name: string }) => {
			setEditingCategoryId(category.id);
			setEditingCategoryName(category.name);

			setTimeout(() => {
				inputRefs.current.get(category.id)?.focus();
			}, 50);
		},
		[],
	);

	const cancelEditCategory = React.useCallback(() => {
		setEditingCategoryId(null);
		setEditingCategoryName("");
	}, []);

	const saveEditCategory = React.useCallback(() => {
		if (editingCategoryId && editingCategoryName.trim()) {
			updateCategory(editingCategoryId, editingCategoryName.trim());
			setEditingCategoryId(null);
			setEditingCategoryName("");
		}
	}, [editingCategoryId, editingCategoryName, updateCategory]);

	const hasPendingEdits =
		newCategoryRows.length > 0 || editingCategoryId !== null;

	const handleSaveAll = React.useCallback(() => {
		for (const row of newCategoryRows) {
			if (row.name.trim()) {
				addCategory(row.parentId, row.name.trim());
			}
		}
		setNewCategoryRows([]);

		if (editingCategoryId && editingCategoryName.trim()) {
			updateCategory(editingCategoryId, editingCategoryName.trim());
			setEditingCategoryId(null);
			setEditingCategoryName("");
		}
	}, [
		newCategoryRows,
		editingCategoryId,
		editingCategoryName,
		addCategory,
		updateCategory,
	]);

	const handleCancelAll = React.useCallback(() => {
		setNewCategoryRows([]);
		setEditingCategoryId(null);
		setEditingCategoryName("");
	}, []);

	const getNewCategoryRowsForParent = React.useCallback(
		(parentId: string | null) => {
			return newCategoryRows.filter((row) => row.parentId === parentId);
		},
		[newCategoryRows],
	);

	return {
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
		getNewCategoryRowsForParent,
	};
}
