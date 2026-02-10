"use client";

import * as React from "react";
import type { ProductImage } from "../schemas/product-form";

export interface UseProductsImagesReturn {
	images: ProductImage[];
	addImages: (files: File[]) => void;
	removeImage: (id: string) => void;
	updateImage: (id: string, updates: Partial<ProductImage>) => void;
	reorderImages: (fromIndex: number, toIndex: number) => void;
	setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

export function useProductsImages(
	initialImages: ProductImage[] = [],
): UseProductsImagesReturn {
	const [images, setImages] = React.useState<ProductImage[]>(initialImages);

	function addImages(files: File[]) {
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));

		const newImages: ProductImage[] = imageFiles.map((file, index) => ({
			id: `${Date.now()}-${index}`,
			file,
			preview: URL.createObjectURL(file),
			name: file.name.split(".")[0],
		}));

		setImages((prev) => [...prev, ...newImages]);
	}

	function removeImage(id: string) {
		setImages((prev) => {
			const imageToRemove = prev.find((img) => img.id === id);
			if (imageToRemove?.preview && imageToRemove.file) {
				URL.revokeObjectURL(imageToRemove.preview);
			}
			return prev.filter((img) => img.id !== id);
		});
	}

	function updateImage(id: string, updates: Partial<ProductImage>) {
		setImages((prev) =>
			prev.map((img) => (img.id === id ? { ...img, ...updates } : img)),
		);
	}

	function reorderImages(fromIndex: number, toIndex: number) {
		setImages((prev) => {
			const newImages = [...prev];
			const [removed] = newImages.splice(fromIndex, 1);
			newImages.splice(toIndex, 0, removed);
			return newImages;
		});
	}

	// Cleanup object URLs on unmount
	React.useEffect(() => {
		return () => {
			images.forEach((img) => {
				if (img.preview && img.file) {
					URL.revokeObjectURL(img.preview);
				}
			});
		};
	}, []);

	return {
		images,
		addImages,
		removeImage,
		updateImage,
		reorderImages,
		setImages,
	};
}
