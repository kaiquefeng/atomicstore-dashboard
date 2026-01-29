import type { ListItem, NewItemRow } from "@/components/shared/types";

export interface Tag extends ListItem {
	slug: string;
}

export interface NewTagRow extends NewItemRow {
	slug: string;
}

export interface TagEditState {
	editingTagId: string | null;
	editingTagName: string;
}
