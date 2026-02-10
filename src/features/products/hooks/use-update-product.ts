"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { convertToSlug } from "@/helpers/convert";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import type {
	CreateProductResponse,
	ProductVariant,
} from "../adapters/create-product.adapter";
import {
	type UpdateProductPayload,
	updateProductAdapter,
} from "../adapters/update-product.adapter";
import type { UploadedImage } from "../adapters/upload-product-images.adapter";
import { useUploadProductImages } from "./use-upload-product-images";

export interface UpdateProductData {
	id: string | number;
	title: string;
	description?: string;
	status?: "draft" | "active" | "archived";
	variants: ProductVariant[];
	stock?: number;
	weightGrams?: number;
	heightMm?: number;
	widthMm?: number;
	lengthMm?: number;
	images: File[]; // Files to upload
	existingImageIds?: Array<{
		id: string;
		url?: string;
		alt?: string;
		sortOrder?: number;
	}>; // Existing image references
	properties?: Array<{
		title: string;
		options: string[];
	}>;
}

export function useUpdateProduct() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();
	const uploadImages = useUploadProductImages();

	return useMutation<CreateProductResponse, Error, UpdateProductData>({
		mutationFn: async (data: UpdateProductData) => {
			// 1. Obter storeId a partir do slug
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			// 2. Fazer upload das novas imagens primeiro
			let uploadedImages: UploadedImage[] = [];
			if (data.images.length > 0) {
				uploadedImages = await uploadImages.mutateAsync(data.images);
			}

			// Combinar imagens existentes com as recém-uploadadas
			// Imagens existentes já têm id, url, alt e sortOrder
			const existingImages = (data.existingImageIds || []).map(
				(img, index) => ({
					id: img.id,
					url: img.url,
					alt: img.alt || "",
					sortOrder: img.sortOrder !== undefined ? img.sortOrder : index,
				}),
			);

			// Novas imagens uploadadas (sem id, apenas url)
			const newImages = uploadedImages.map((img, index) => ({
				url: img.url,
				alt: "",
				sortOrder: existingImages.length + index,
			}));

			const allImages = [...existingImages, ...newImages];

			// 3. Montar payload do produto
			const slug = convertToSlug(data.title);
			const payload: UpdateProductPayload = {
				id: data.id,
				slug,
				title: data.title,
				status: data.status || "draft",
				storeId: currentStore.id,
				variants: data.variants,
				stock: data.stock,
				weightGrams: data.weightGrams,
				heightMm: data.heightMm,
				widthMm: data.widthMm,
				lengthMm: data.lengthMm,
				description: data.description,
				images: allImages,
				properties: data.properties,
			};

			// 4. Atualizar o produto
			return await updateProductAdapter(payload);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			queryClient.invalidateQueries({ queryKey: ["product", data.id] });
			toast.success("Produto atualizado com sucesso!");
			return data;
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao atualizar produto. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
