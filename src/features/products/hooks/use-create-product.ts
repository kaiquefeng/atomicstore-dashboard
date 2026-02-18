"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { convertToSlug } from "@/helpers/convert";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";
import {
	type CreateProductPayload,
	type CreateProductResponse,
	createProductAdapter,
	type ProductVariant,
} from "../adapters/create-product.adapter";
import type { UploadedImage } from "../adapters/upload-product-images.adapter";
import { useUploadProductImages } from "./use-upload-product-images";

export interface CreateProductData {
	title: string;
	description?: string;
	status?: "draft" | "active" | "archived";
	categoryIds?: string[];
	tagIds?: string[];
	variants: ProductVariant[];
	images: File[];
	stock?: number;
	weightGrams?: number;
	heightMm?: number;
	widthMm?: number;
	lengthMm?: number;
	properties?: Array<{
		title: string;
		options: string[];
	}>;
}

export function useCreateProduct() {
	const queryClient = useQueryClient();
	const storeSlug = useStoreSlug();
	const { stores } = useStores();
	const uploadImages = useUploadProductImages();

	return useMutation<CreateProductResponse, Error, CreateProductData>({
		mutationFn: async (data: CreateProductData) => {
			// 1. Obter storeId a partir do slug
			if (!storeSlug) {
				throw new Error("Slug da loja não encontrado");
			}

			const currentStore = stores.find((store) => store.slug === storeSlug);
			if (!currentStore) {
				throw new Error("Loja não encontrada");
			}

			// 2. Fazer upload das imagens primeiro
			let uploadedImages: UploadedImage[] = [];
			if (data.images.length > 0) {
				uploadedImages = await uploadImages.mutateAsync(data.images);
			}

			// 3. Montar payload do produto
			const slug = convertToSlug(data.title);
			const payload: CreateProductPayload = {
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
				categoryIds: data.categoryIds?.length ? data.categoryIds : undefined,
				tagIds: data.tagIds?.length ? data.tagIds : undefined,
				images: uploadedImages.map((img) => ({
					id: img.id,
					url: img.url,
				})),
				properties: data.properties,
			};

			// 4. Criar o produto
			return await createProductAdapter(payload);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			toast.success("Produto criado com sucesso!");
			return data;
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao criar produto. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
