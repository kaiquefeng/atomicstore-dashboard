export interface ListItem {
	id: string;
	name: string;
	hidden: boolean;
}

export interface NewItemRow {
	tempId: string;
	name: string;
}

export interface ItemActionsConfig {
	canCreateChild?: boolean;
	onCreateChild?: (id: string) => void;
	createChildLabel?: string;
}
