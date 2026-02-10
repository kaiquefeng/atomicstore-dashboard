import type { ListItem, NewItemRow } from "@/components/shared/types";

export interface Category extends ListItem {
	isActive: boolean;
	slug: string;
	parentId: string | null;
	children: Category[];
}

export interface NewCategoryRow extends NewItemRow {
	parentId: string | null;
}

export interface CategoryDragState {
	draggedId: string | null;
	dragOverId: string | null;
}

export interface CategoryEditState {
	editingCategoryId: string | null;
	editingCategoryName: string;
}
