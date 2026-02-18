"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { generateBarcode, generateSKU } from "@/helpers/convert";
import type {
	ProductImage,
	ProductVariant,
	VariantOption,
	VideoItem,
} from "../schemas/product-form";
import { productFormSchema } from "../schemas/product-form";
import { useProductsImages } from "./use-products-images";

export interface UseProductFormOptions {
	initialData?: {
		title?: string;
		description?: string;
		categoryIds?: string[];
		stock?: string;
		weight?: string;
		height?: string;
		width?: string;
		length?: string;
		status?: "draft" | "active" | "archived";
		tagIds?: string[];
		productVariants?: ProductVariant[];
		productImages?: ProductImage[];
		variantOptions?: VariantOption[];
		categoryVideos?: VideoItem[];
	};
}

export interface UseProductFormReturn {
	form: ReturnType<
		typeof useForm<
			z.input<typeof productFormSchema>,
			unknown,
			z.output<typeof productFormSchema>
		>
	>;
	images: ReturnType<typeof useProductsImages>;
	// Variant management
	variants: ProductVariant[];
	setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
	addVariant: () => void;
	updateVariant: (id: string, updates: Partial<ProductVariant>) => void;
	removeVariant: (id: string) => void;
	setDefaultVariant: (id: string) => void;
	updateVariantMetadata: (id: string, key: string, value: string) => void;
	// Variant options management
	variantOptions: VariantOption[];
	setVariantOptions: React.Dispatch<React.SetStateAction<VariantOption[]>>;
	addVariantOption: () => void;
	removeVariantOption: (id: string) => void;
	updateVariantOption: (id: string, updates: Partial<VariantOption>) => void;
	addValueToVariant: (variantId: string, value: string) => void;
	removeValueFromVariant: (variantId: string, valueIndex: number) => void;
	generateVariantsFromOptions: () => void;
	// Videos management
	videos: VideoItem[];
	setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
	addVideos: (files: File[]) => void;
	removeVideo: (id: string) => void;
}

export function useProductForm(
	options: UseProductFormOptions = {},
): UseProductFormReturn {
	const { initialData } = options;

	const form = useForm<
		z.input<typeof productFormSchema>,
		unknown,
		z.output<typeof productFormSchema>
	>({
		resolver: zodResolver(productFormSchema),
		defaultValues: {
			title: initialData?.title ?? "",
			description: initialData?.description ?? "",
			categoryIds: initialData?.categoryIds ?? [],
			stock: initialData?.stock ?? "",
			weight: initialData?.weight ?? "",
			height: initialData?.height ?? "",
			width: initialData?.width ?? "",
			length: initialData?.length ?? "",
			status: (initialData?.status ?? "draft") as
				| "draft"
				| "active"
				| "archived",
			tagIds: initialData?.tagIds ?? [],
			productVariants: initialData?.productVariants ?? [],
			productImages: initialData?.productImages ?? [],
			variantOptions: initialData?.variantOptions ?? [],
			categoryVideos: initialData?.categoryVideos ?? [],
		},
	});

	const images = useProductsImages(initialData?.productImages || []);

	const [variants, setVariants] = React.useState<ProductVariant[]>(
		initialData?.productVariants || [],
	);

	const [variantOptions, setVariantOptions] = React.useState<VariantOption[]>(
		initialData?.variantOptions || [],
	);

	const [videos, setVideos] = React.useState<VideoItem[]>(
		initialData?.categoryVideos || [],
	);

	// Sync images with form
	React.useEffect(() => {
		form.setValue("productImages", images.images, { shouldDirty: false });
	}, [images.images, form]);

	// Sync variants with form
	React.useEffect(() => {
		form.setValue("productVariants", variants, { shouldDirty: false });
	}, [variants, form]);

	// Sync variant options with form
	React.useEffect(() => {
		form.setValue("variantOptions", variantOptions, { shouldDirty: false });
	}, [variantOptions, form]);

	// Sync videos with form
	React.useEffect(() => {
		form.setValue("categoryVideos", videos, { shouldDirty: false });
	}, [videos, form]);

	function addVariant() {
		const title = form.watch("title");
		const newVariant: ProductVariant = {
			id: `${Date.now()}`,
			sku: title.trim() ? generateSKU(title, variants.length) : "",
			priceBrl: "",
			compareAtBrl: "",
			costBrl: "",
			title: `Nova Variação ${variants.length + 1}`,
			barcode: generateBarcode(variants.length),
			isDefault: variants.length === 0,
			stock: "",
			showPrice: true,
			weightKg: "",
			lengthCm: "",
			widthCm: "",
			heightCm: "",
			metadata: {},
		};
		setVariants((prev) => [...prev, newVariant]);
	}

	function updateVariant(id: string, updates: Partial<ProductVariant>) {
		setVariants((prev) =>
			prev.map((v) => (v.id === id ? { ...v, ...updates } : v)),
		);
	}

	function removeVariant(id: string) {
		setVariants((prev) => {
			const filtered = prev.filter((v) => v.id !== id);
			// If we removed the default variant, make the first one default
			if (filtered.length > 0 && !filtered.some((v) => v.isDefault)) {
				filtered[0].isDefault = true;
			}
			return filtered;
		});
	}

	function setDefaultVariant(id: string) {
		setVariants((prev) =>
			prev.map((v) => ({
				...v,
				isDefault: v.id === id,
			})),
		);
	}

	function updateVariantMetadata(id: string, key: string, value: string) {
		setVariants((prev) =>
			prev.map((v) =>
				v.id === id ? { ...v, metadata: { ...v.metadata, [key]: value } } : v,
			),
		);
	}

	function addVariantOption() {
		setVariantOptions((prev) => [
			...prev,
			{ id: `${Date.now()}`, name: "", values: [] },
		]);
	}

	function removeVariantOption(id: string) {
		setVariantOptions((prev) => prev.filter((v) => v.id !== id));
	}

	function updateVariantOption(id: string, updates: Partial<VariantOption>) {
		setVariantOptions((prev) =>
			prev.map((v) => (v.id === id ? { ...v, ...updates } : v)),
		);
	}

	function addValueToVariant(variantId: string, value: string) {
		if (!value.trim()) return;
		setVariantOptions((prev) =>
			prev.map((v) =>
				v.id === variantId ? { ...v, values: [...v.values, value.trim()] } : v,
			),
		);
	}

	function removeValueFromVariant(variantId: string, valueIndex: number) {
		setVariantOptions((prev) =>
			prev.map((v) =>
				v.id === variantId
					? { ...v, values: v.values.filter((_, i) => i !== valueIndex) }
					: v,
			),
		);
	}

	function generateVariantsFromOptions() {
		if (variantOptions.length === 0) return;

		const title = form.watch("title");
		const colorOption = variantOptions.find((o) => o.name === "Color");
		const sizeOption = variantOptions.find((o) => o.name === "Size");

		const newVariants: ProductVariant[] = [];
		let counter = 1;

		if (colorOption && sizeOption) {
			for (const color of colorOption.values) {
				for (const size of sizeOption.values) {
					newVariants.push({
						id: `${Date.now()}-${counter}`,
						sku: title.trim() ? generateSKU(title, counter - 1) : "",
						priceBrl: "",
						compareAtBrl: "",
						costBrl: "",
						title: `${color} ${size}`,
						barcode: generateBarcode(counter - 1),
						isDefault: counter === 1,
						stock: "",
						showPrice: true,
						weightKg: "",
						lengthCm: "",
						widthCm: "",
						heightCm: "",
						metadata: { size, color },
					});
					counter++;
				}
			}
		} else if (colorOption || sizeOption) {
			const option = colorOption || sizeOption;
			const optionKey = colorOption ? "color" : "size";
			if (option) {
				for (const value of option.values) {
					newVariants.push({
						id: `${Date.now()}-${counter}`,
						sku: title.trim() ? generateSKU(title, counter - 1) : "",
						priceBrl: "",
						compareAtBrl: "",
						costBrl: "",
						title: value,
						barcode: generateBarcode(counter - 1),
						isDefault: counter === 1,
						stock: "",
						showPrice: true,
						weightKg: "",
						lengthCm: "",
						widthCm: "",
						heightCm: "",
						metadata: { [optionKey]: value },
					});
					counter++;
				}
			}
		}

		if (newVariants.length > 0) {
			setVariants(newVariants.slice(0, 50)); // Limit to 50 variants
		}
	}

	function addVideos(files: File[]) {
		const videoFiles = files.filter((file) => file.type.startsWith("video/"));

		const newVideos: VideoItem[] = videoFiles.map((file, index) => ({
			id: `${Date.now()}-${index}`,
			url: URL.createObjectURL(file),
			title: file.name.split(".")[0],
			thumbnail: undefined,
		}));

		setVideos((prev) => [...prev, ...newVideos]);
	}

	function removeVideo(id: string) {
		setVideos((prev) => {
			const videoToRemove = prev.find((v) => v.id === id);
			if (videoToRemove?.url) {
				URL.revokeObjectURL(videoToRemove.url);
			}
			return prev.filter((v) => v.id !== id);
		});
	}

	return {
		form,
		images,
		variants,
		setVariants,
		addVariant,
		updateVariant,
		removeVariant,
		setDefaultVariant,
		updateVariantMetadata,
		variantOptions,
		setVariantOptions,
		addVariantOption,
		removeVariantOption,
		updateVariantOption,
		addValueToVariant,
		removeValueFromVariant,
		generateVariantsFromOptions,
		videos,
		setVideos,
		addVideos,
		removeVideo,
	};
}
