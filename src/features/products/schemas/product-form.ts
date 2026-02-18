import { z } from "zod";

export const variantOptionSchema = z.object({
	id: z.string(),
	name: z.string(),
	values: z.array(z.string()),
});

export const productImageSchema = z.object({
	id: z.string(),
	file: z.instanceof(File).nullable(),
	preview: z.string(),
	name: z.string(),
});

export const productVariantSchema = z.object({
	id: z.string(),
	sku: z.string(),
	priceBrl: z.string(),
	compareAtBrl: z.string(),
	costBrl: z.string(),
	title: z.string(),
	barcode: z.string(),
	isDefault: z.boolean(),
	stock: z.string(),
	showPrice: z.boolean(),
	weightKg: z.string(),
	lengthCm: z.string(),
	widthCm: z.string(),
	heightCm: z.string(),
	imageId: z.string().optional(),
	metadata: z.record(z.string(), z.string().optional()),
});

export const videoItemSchema = z.object({
	id: z.string(),
	url: z.string(),
	title: z.string(),
	thumbnail: z.string().optional(),
});

export const productFormSchema = z.object({
	title: z.string().min(1, "Título do produto é obrigatório"),
	description: z.string().optional(),
	categoryIds: z.array(z.string()).optional().default([]),
	stock: z.string().optional(),
	weight: z.string().optional(),
	height: z.string().optional(),
	width: z.string().optional(),
	length: z.string().optional(),
	status: z.enum(["draft", "active", "archived"]),
	tagIds: z.array(z.string()).optional().default([]),
	productVariants: z.array(productVariantSchema),
	productImages: z.array(productImageSchema),
	variantOptions: z.array(variantOptionSchema),
	categoryVideos: z.array(videoItemSchema),
});

export type VariantOption = z.infer<typeof variantOptionSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type VideoItem = z.infer<typeof videoItemSchema>;
export type ProductFormData = z.infer<typeof productFormSchema>;
