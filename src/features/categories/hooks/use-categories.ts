import * as React from "react";
import { generateSlug } from "@/helpers/generate";
import type { Category, NewCategoryRow } from "../types";

const INITIAL_CATEGORIES: Category[] = [
	{
		id: "1",
		name: "Roupas",
		slug: "roupas",
		hidden: false,
		parentId: null,
		children: [
			{
				id: "1-1",
				name: "Camisetas",
				slug: "camisetas",
				hidden: false,
				parentId: "1",
				children: [],
			},
			{
				id: "1-2",
				name: "Calças",
				slug: "calcas",
				hidden: false,
				parentId: "1",
				children: [
					{
						id: "1-2-1",
						name: "Jeans",
						slug: "jeans",
						hidden: false,
						parentId: "1-2",
						children: [],
					},
				],
			},
		],
	},
	{
		id: "2",
		name: "Acessórios",
		slug: "acessorios",
		hidden: false,
		parentId: null,
		children: [
			{
				id: "2-1",
				name: "Bolsas",
				slug: "bolsas",
				hidden: false,
				parentId: "2",
				children: [],
			},
		],
	},
];

export function useCategories() {
	const [categories, setCategories] =
		React.useState<Category[]>(INITIAL_CATEGORIES);
	const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
		new Set(["1", "1-2"]),
	);

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

	const addCategoryToParent = React.useCallback(
		(cats: Category[], parentId: string, newCategory: Category): Category[] => {
			return cats.map((cat) => {
				if (cat.id === parentId) {
					return { ...cat, children: [...cat.children, newCategory] };
				}
				return {
					...cat,
					children: addCategoryToParent(cat.children, parentId, newCategory),
				};
			});
		},
		[],
	);

	const addCategory = React.useCallback(
		(parentId: string | null, name: string) => {
			const newCategory: Category = {
				id: `${Date.now()}`,
				name,
				slug: generateSlug(name),
				hidden: false,
				parentId,
				children: [],
			};

			if (parentId === null) {
				setCategories((prev) => [...prev, newCategory]);
			} else {
				setCategories((prev) =>
					addCategoryToParent(prev, parentId, newCategory),
				);
				setExpandedIds((prev) => new Set([...prev, parentId]));
			}
		},
		[addCategoryToParent],
	);

	const updateCategoryInTree = React.useCallback(
		(cats: Category[], id: string, name: string): Category[] => {
			return cats.map((cat) => {
				if (cat.id === id) {
					return { ...cat, name, slug: generateSlug(name) };
				}
				return {
					...cat,
					children: updateCategoryInTree(cat.children, id, name),
				};
			});
		},
		[],
	);

	const updateCategory = React.useCallback(
		(id: string, name: string) => {
			setCategories((prev) => updateCategoryInTree(prev, id, name));
		},
		[updateCategoryInTree],
	);

	const toggleHiddenInTree = React.useCallback(
		(cats: Category[], id: string): Category[] => {
			return cats.map((cat) => {
				if (cat.id === id) {
					return { ...cat, hidden: !cat.hidden };
				}
				return { ...cat, children: toggleHiddenInTree(cat.children, id) };
			});
		},
		[],
	);

	const toggleHidden = React.useCallback(
		(id: string) => {
			setCategories((prev) => toggleHiddenInTree(prev, id));
		},
		[toggleHiddenInTree],
	);

	const deleteCategoryFromTree = React.useCallback(
		(cats: Category[], id: string): Category[] => {
			return cats
				.filter((cat) => cat.id !== id)
				.map((cat) => ({
					...cat,
					children: deleteCategoryFromTree(cat.children, id),
				}));
		},
		[],
	);

	const deleteCategory = React.useCallback(
		(id: string) => {
			setCategories((prev) => deleteCategoryFromTree(prev, id));
		},
		[deleteCategoryFromTree],
	);

	const moveCategory = React.useCallback(
		(draggedId: string, targetId: string) => {
			const draggedCategory = findCategoryById(categories, draggedId);
			if (draggedCategory) {
				let newCategories = deleteCategoryFromTree(categories, draggedId);
				const updatedCategory = { ...draggedCategory, parentId: targetId };
				newCategories = addCategoryToParent(
					newCategories,
					targetId,
					updatedCategory,
				);
				setCategories(newCategories);
				setExpandedIds((prev) => new Set([...prev, targetId]));
			}
		},
		[categories, findCategoryById, deleteCategoryFromTree, addCategoryToParent],
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
