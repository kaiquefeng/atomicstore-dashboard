import type {
	ProductFormData,
	ProductImage,
	ProductVariant,
	VariantOption,
} from "../schemas/product-form";

export function transformProductDataToFormData(
	productData: any,
): Partial<ProductFormData> {
	const formData: Partial<ProductFormData> = {
		title: productData.title || productData.name || "",
		description: (productData.description as string) || "",
		status: (productData.status as "draft" | "active" | "archived") || "draft",
		category: (productData.category as string) || "",
		tags: (productData.tags as string) || "",
		stock: productData.stock ? String(productData.stock) : "",
		weight: productData.weight ? String(productData.weight) : "",
		height: productData.height ? String(productData.height) : "",
		width: productData.width ? String(productData.width) : "",
		length: productData.length ? String(productData.length) : "",
	};

	// Transform variant options from metadata.properties
	const metadata = productData.metadata as
		| {
				properties?: Array<{
					title: string;
					options: string[];
				}>;
		  }
		| undefined;
	if (metadata?.properties && Array.isArray(metadata.properties)) {
		const loadedVariantOptions: VariantOption[] = metadata.properties.map(
			(prop, index) => ({
				id: `property-${Date.now()}-${index}`,
				name: prop.title,
				values: prop.options || [],
			}),
		);
		formData.variantOptions = loadedVariantOptions;
	}

	// Transform images
	const images = productData.images || [];
	if (images.length > 0 || productData.image) {
		const imageArray = Array.isArray(images) ? images : [productData.image];
		const loadedImages: ProductImage[] = imageArray
			.filter((img) => {
				if (!img) return false;
				if (typeof img === "string") return !!img;
				const imgObj = img as unknown as { url?: string; id?: string };
				return !!imgObj?.url;
			})
			.map((img, index) => {
				if (typeof img === "string") {
					return {
						id: `loaded-${index}`,
						file: null,
						preview: img,
						name: `Imagem ${index + 1}`,
					};
				}
				const imgObj = img as unknown as {
					id?: string;
					url?: string;
					alt?: string;
					sortOrder?: number;
				};
				return {
					id: imgObj.id || `loaded-${index}`,
					file: null,
					preview: imgObj.url || "",
					name: imgObj.alt || `Imagem ${index + 1}`,
				};
			});
		formData.productImages = loadedImages;
	}

	// Transform variants
	const variants = (productData.variants ||
		productData.defaultVariant ||
		[]) as unknown[];
	if (variants.length > 0) {
		const loadedVariants: ProductVariant[] = variants.map(
			(variant: any, index) => {
				const isDefault = variant.isDefault || index === 0;
				return {
					id: variant.id || `variant-${index}`,
					sku: variant.sku || "",
					priceBrl: variant.priceBrl
						? String(variant.priceBrl)
						: variant.price
							? String(variant.price)
							: "",
					compareAtBrl: variant.compareAtPriceBrl
						? String(variant.compareAtPriceBrl)
						: variant.compareAtPrice
							? String(variant.compareAtPrice)
							: "",
					costBrl: variant.costBrl
						? String(variant.costBrl)
						: variant.cost
							? String(variant.cost)
							: "",
					title: variant.title || `Variação ${index + 1}`,
					barcode: variant.barcode || "",
					isDefault,
					stock: variant.stock ? String(variant.stock) : "",
					showPrice: variant.showPrice !== false,
					weightKg: variant.weightKg
						? String(variant.weightKg)
						: variant.weight
							? String(variant.weight)
							: "",
					lengthCm: variant.lengthCm
						? String(variant.lengthCm)
						: variant.length
							? String(variant.length)
							: "",
					widthCm: variant.widthCm
						? String(variant.widthCm)
						: variant.width
							? String(variant.width)
							: "",
					heightCm: variant.heightCm
						? String(variant.heightCm)
						: variant.height
							? String(variant.height)
							: "",
					imageId: variant.imageId || undefined,
					metadata: variant.metadata || {},
				};
			},
		);
		formData.productVariants = loadedVariants;
	} else if (productData.defaultVariant) {
		const defaultVariant = productData.defaultVariant as any;
		const loadedVariant: ProductVariant = {
			id: "default-variant",
			sku: defaultVariant.sku || "",
			priceBrl: defaultVariant.priceBrl
				? String(defaultVariant.priceBrl)
				: defaultVariant.price
					? String(defaultVariant.price)
					: "",
			compareAtBrl: defaultVariant.compareAtPriceBrl
				? String(defaultVariant.compareAtPriceBrl)
				: "",
			costBrl: defaultVariant.costBrl ? String(defaultVariant.costBrl) : "",
			title: "Variação Padrão",
			barcode: defaultVariant.barcode || "",
			isDefault: true,
			stock: defaultVariant.stock ? String(defaultVariant.stock) : "",
			showPrice: true,
			weightKg: defaultVariant.weightKg ? String(defaultVariant.weightKg) : "",
			lengthCm: defaultVariant.lengthCm ? String(defaultVariant.lengthCm) : "",
			widthCm: defaultVariant.widthCm ? String(defaultVariant.widthCm) : "",
			heightCm: defaultVariant.heightCm ? String(defaultVariant.heightCm) : "",
			metadata: defaultVariant.metadata || {},
		};
		formData.productVariants = [loadedVariant];
	}

	return formData;
}
