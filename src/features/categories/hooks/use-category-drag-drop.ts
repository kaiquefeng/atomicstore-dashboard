import * as React from "react";

interface UseCategoryDragDropProps {
	onMoveCategory: (draggedId: string, targetId: string) => void;
}

export function useCategoryDragDrop({ onMoveCategory }: UseCategoryDragDropProps) {
	const [draggedId, setDraggedId] = React.useState<string | null>(null);
	const [dragOverId, setDragOverId] = React.useState<string | null>(null);

	const handleDragStart = React.useCallback((id: string) => {
		setDraggedId(id);
	}, []);

	const handleDragOver = React.useCallback((e: React.DragEvent, id: string) => {
		e.preventDefault();
		setDragOverId(id);
	}, []);

	const handleDragEnd = React.useCallback(() => {
		if (draggedId && dragOverId && draggedId !== dragOverId) {
			onMoveCategory(draggedId, dragOverId);
		}
		setDraggedId(null);
		setDragOverId(null);
	}, [draggedId, dragOverId, onMoveCategory]);

	const getDragHandlers = React.useCallback(
		(id: string) => ({
			onDragStart: () => handleDragStart(id),
			onDragOver: (e: React.DragEvent) => handleDragOver(e, id),
			onDragEnd: handleDragEnd,
		}),
		[handleDragStart, handleDragOver, handleDragEnd],
	);

	return {
		draggedId,
		dragOverId,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		getDragHandlers,
	};
}
