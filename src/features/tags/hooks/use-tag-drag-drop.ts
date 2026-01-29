import * as React from "react";

interface UseTagDragDropProps {
	onReorderTag: (draggedId: string, targetIndex: number) => void;
}

export function useTagDragDrop({ onReorderTag }: UseTagDragDropProps) {
	const [draggedId, setDraggedId] = React.useState<string | null>(null);
	const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

	const handleDragStart = React.useCallback((id: string) => {
		setDraggedId(id);
	}, []);

	const handleDragOver = React.useCallback(
		(e: React.DragEvent, index: number) => {
			e.preventDefault();
			setDragOverIndex(index);
		},
		[],
	);

	const handleDragEnd = React.useCallback(() => {
		if (draggedId && dragOverIndex !== null) {
			onReorderTag(draggedId, dragOverIndex);
		}
		setDraggedId(null);
		setDragOverIndex(null);
	}, [draggedId, dragOverIndex, onReorderTag]);

	return {
		draggedId,
		dragOverIndex,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	};
}
