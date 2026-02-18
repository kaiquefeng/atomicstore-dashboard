"use client";

import { IconArrowLeft, IconLoader } from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { FormProvider } from "react-hook-form";
import { ProductBasicInfo } from "@/components/products/product-basic-info";
import { ProductImagesUpload } from "@/components/products/product-images-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { ProductVariant as ApiProductVariant } from "@/features/products/adapters/create-product.adapter";
import { ProductVariantsSection } from "@/features/products/components/product-variants-section";
import { ProductVideoSection } from "@/features/products/components/product-video-section";
import { VariantEditDrawer } from "@/features/products/components/variant-edit-drawer";
import { VariantImagePickerDrawer } from "@/features/products/components/variant-image-picker-drawer";
import { useCreateProduct } from "@/features/products/hooks/use-create-product";
import { useProductById } from "@/features/products/hooks/use-product-by-id";
import { useProductForm } from "@/features/products/hooks/use-product-form";
import { useUpdateProduct } from "@/features/products/hooks/use-update-product";
import type {
	ProductFormData,
	ProductVariant,
} from "@/features/products/schemas/product-form";
import { transformProductDataToFormData } from "@/features/products/utils/transform-product-data";
import { generateBarcode, generateSKU } from "@/helpers/convert";

export const Route = createFileRoute("/$store/_layout/products_/add")({
	component: AddProductPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			edit: (search.edit as string | undefined) || undefined,
		};
	},
});

function AddProductPage() {
	const navigate = useNavigate();
	const { store } = Route.useParams();
	const { edit: productId } = Route.useSearch();
	const isEditMode = !!productId;

	const { data: productData, isLoading: isLoadingProduct } = useProductById(
		productId as string | number | undefined,
	);

	const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
	const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
	const isPending = isCreating || isUpdating;

	const initialFormData = React.useMemo(() => {
		if (isEditMode && productData) {
			return transformProductDataToFormData(productData);
		}
		return undefined;
	}, [isEditMode, productData]);

	const productForm = useProductForm({
		initialData: initialFormData,
	});

	const {
		form,
		images,
		variants: productVariants,
		setVariants: setProductVariants,
		addVariant: addProductVariant,
		updateVariant: updateProductVariant,
		variantOptions,
		setVariantOptions,
		addVariantOption,
		removeVariantOption,
		updateVariantOption,
		addValueToVariant,
		removeValueFromVariant,
		generateVariantsFromOptions,
		videos: categoryVideos,
		setVideos: setCategoryVideos,
		addVideos: handleVideoFileInput,
		removeVideo: removeVideoItem,
	} = productForm;

	const status = form.watch("status");
	const title = form.watch("title");

	const [imagePickerVariantId, setImagePickerVariantId] = React.useState<
		string | null
	>(null);

	const [editVariantId, setEditVariantId] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (initialFormData?.productImages) {
			images.setImages(initialFormData.productImages);
		}
	}, [initialFormData?.productImages, images.setImages]);

	React.useEffect(() => {
		if (initialFormData?.productVariants) {
			setProductVariants(initialFormData.productVariants);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialFormData?.productVariants, setProductVariants]);

	React.useEffect(() => {
		if (initialFormData?.variantOptions) {
			setVariantOptions(initialFormData.variantOptions);
		}
	}, [initialFormData?.variantOptions, setVariantOptions]);

	React.useEffect(() => {
		if (initialFormData?.categoryVideos) {
			setCategoryVideos(initialFormData.categoryVideos);
		}
	}, [initialFormData?.categoryVideos, setCategoryVideos]);

	React.useEffect(() => {
		if (title?.trim() && productVariants.length > 0) {
			setProductVariants((prev) =>
				prev.map((variant, index) => {
					const updates: Partial<ProductVariant> = {};

					if (!variant.sku || variant.sku.trim() === "") {
						updates.sku = generateSKU(title, index);
					}

					if (!variant.barcode || variant.barcode.trim() === "") {
						updates.barcode = generateBarcode(index);
					}

					return Object.keys(updates).length > 0
						? { ...variant, ...updates }
						: variant;
				}),
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [title, productVariants.length, setProductVariants]);

	function handleSubmit(data: ProductFormData) {
		const parsedStock = data.stock ? Number(data.stock) : undefined;
		const stock = Number.isFinite(parsedStock as number)
			? (parsedStock as number)
			: undefined;

		const parsedWeightGrams = data.weight ? Number(data.weight) : undefined;
		const weightGrams = Number.isFinite(parsedWeightGrams as number)
			? (parsedWeightGrams as number)
			: undefined;

		const parsedHeightCm = data.height ? Number(data.height) : undefined;
		const heightMm =
			Number.isFinite(parsedHeightCm as number) &&
			(parsedHeightCm as number) > 0
				? (parsedHeightCm as number) * 10
				: undefined;

		const parsedWidthCm = data.width ? Number(data.width) : undefined;
		const widthMm =
			Number.isFinite(parsedWidthCm as number) && (parsedWidthCm as number) > 0
				? (parsedWidthCm as number) * 10
				: undefined;

		const parsedLengthCm = data.length ? Number(data.length) : undefined;
		const lengthMm =
			Number.isFinite(parsedLengthCm as number) &&
			(parsedLengthCm as number) > 0
				? (parsedLengthCm as number) * 10
				: undefined;

		const properties = variantOptions
			.filter((option) => option.values.length > 0)
			.map((option) => ({
				title: option.name,
				options: option.values,
			}));

		const imageFiles = images.images
			.filter((img) => img.file !== null)
			.map((img) => img.file as File);

		const existingImageReferences = images.images
			.filter(
				(img) => img.file === null && img.id && !img.id.startsWith("loaded-"),
			)
			.map((img, index) => ({
				id: img.id,
				url: img.preview,
				alt: img.name || "",
				sortOrder: index,
			}));

		if (productVariants.length === 0) {
			throw new Error(
				"É necessário criar pelo menos uma variação com SKU, Preço e Código de barras",
			);
		}

		const variants: ApiProductVariant[] = productVariants.map((variant) => {
			const priceBrlValue = variant.priceBrl
				? parseFloat(variant.priceBrl.replace(/[^\d.,]/g, "").replace(",", "."))
				: 0;

			if (!variant.sku || variant.sku.trim() === "") {
				throw new Error(
					`SKU é obrigatório para a variação: ${variant.title || "Sem título"}`,
				);
			}

			if (!priceBrlValue || priceBrlValue <= 0) {
				throw new Error(
					`Preço deve ser maior que zero para a variação: ${variant.title || "Sem título"}`,
				);
			}

			if (!variant.barcode || variant.barcode.trim() === "") {
				throw new Error(
					`Código de barras é obrigatório para a variação: ${variant.title || "Sem título"}`,
				);
			}

			const variantData: ApiProductVariant = {
				sku: variant.sku.trim(),
				priceBrl: priceBrlValue,
				title: variant.title || "",
				barcode: variant.barcode.trim(),
				isDefault: variant.isDefault,
				compareAtBrl: variant.compareAtBrl
					? parseFloat(
							variant.compareAtBrl.replace(/[^\d.,]/g, "").replace(",", "."),
						)
					: undefined,
				metadata:
					variant.metadata && Object.keys(variant.metadata).length > 0
						? (variant.metadata as Record<string, string | undefined>)
						: undefined,
			};

			Object.keys(variantData).forEach((key) => {
				if (
					variantData[key as keyof typeof variantData] === undefined &&
					key !== "isDefault"
				) {
					delete variantData[key as keyof typeof variantData];
				}
			});

			return variantData;
		});

		const hasDefault = variants.some((v) => v.isDefault);
		if (!hasDefault && variants.length > 0) {
			variants[0].isDefault = true;
		}

		if (isEditMode && productId) {
			updateProduct(
				{
					id: productId as string | number,
					title: data.title.trim(),
					description: data.description || undefined,
					status: (data.status as "draft" | "active" | "archived") || "draft",
					categoryIds: data.categoryIds?.length ? data.categoryIds : undefined,
					tagIds: data.tagIds?.length ? data.tagIds : undefined,
					variants,
					images: imageFiles,
					existingImageIds: existingImageReferences,
					stock,
					weightGrams,
					heightMm,
					widthMm,
					lengthMm,
					properties: properties.length > 0 ? properties : undefined,
				},
				{
					onSuccess: () => {
						navigate({
							to: "/$store/products",
							params: { store },
						});
					},
				},
			);
		} else {
			createProduct(
				{
					title: data.title.trim(),
					description: data.description || undefined,
					status: (data.status as "draft" | "active" | "archived") || "draft",
					categoryIds: data.categoryIds?.length ? data.categoryIds : undefined,
					tagIds: data.tagIds?.length ? data.tagIds : undefined,
					variants,
					images: imageFiles,
					stock,
					weightGrams,
					heightMm,
					widthMm,
					lengthMm,
					properties: properties.length > 0 ? properties : undefined,
				},
				{
					onSuccess: () => {
						navigate({
							to: "/$store/products",
							params: { store },
						});
					},
				},
			);
		}
	}

	if (isEditMode && isLoadingProduct) {
		return (
			<div className="flex items-center justify-center h-64">
				<IconLoader className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-3xl space-y-8 pb-12">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/$store/products" params={{ store }}>
						<IconArrowLeft className="size-5" />
						<span className="sr-only">Back to products</span>
					</Link>
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold tracking-tight">
						{isEditMode ? "Editar Produto" : "Adicionar Novo Produto"}
					</h1>
					<p className="text-muted-foreground text-sm">
						{isEditMode
							? "Edite as informações do produto"
							: "Crie uma nova listagem de produto para sua loja"}
					</p>
				</div>
				{isLoadingProduct ? (
					<Badge variant="outline">Carregando...</Badge>
				) : (
					<Badge
						variant="outline"
						className="text-emerald-600 border-emerald-200 bg-emerald-50"
					>
						{status === "draft"
							? "Rascunho"
							: status === "active"
								? "Ativo"
								: "Arquivado"}
					</Badge>
				)}
			</div>

			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
					<ProductBasicInfo />

					<ProductImagesUpload
						images={images.images}
						onAddImages={images.addImages}
						onRemoveImage={images.removeImage}
					/>

					<ProductVideoSection
						videos={categoryVideos}
						onAddVideos={handleVideoFileInput}
						onRemoveVideo={removeVideoItem}
					/>

					<ProductVariantsSection
						variants={productVariants}
						variantOptions={variantOptions}
						onAddVariant={addProductVariant}
						onUpdateVariant={updateProductVariant}
						onSetVariants={setProductVariants}
						onAddVariantOption={addVariantOption}
						onRemoveVariantOption={removeVariantOption}
						onUpdateVariantOption={updateVariantOption}
						onAddValueToVariant={addValueToVariant}
						onRemoveValueFromVariant={removeValueFromVariant}
						onGenerateVariantsFromOptions={generateVariantsFromOptions}
						onOpenImagePicker={setImagePickerVariantId}
						onOpenEditDrawer={setEditVariantId}
						images={images.images}
					/>

					<VariantImagePickerDrawer
						imagePickerVariantId={imagePickerVariantId}
						onClose={() => setImagePickerVariantId(null)}
						images={images.images}
						variants={productVariants}
						onUpdateVariant={updateProductVariant}
					/>

					<VariantEditDrawer
						editVariantId={editVariantId}
						onClose={() => setEditVariantId(null)}
						onNavigate={setEditVariantId}
						variants={productVariants}
						onUpdateVariant={updateProductVariant}
						isPending={isPending}
					/>

					{/* Inventory & Dimensions */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
									5
								</span>
								Inventory & Dimensions
							</CardTitle>
							<CardDescription>
								Manage stock levels and product measurements
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="stock">Quantidade em Estoque</Label>
									<Input
										id="stock"
										type="number"
										placeholder="0"
										{...form.register("stock")}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="status">Status do Produto</Label>
									<Select
										value={status || "draft"}
										onValueChange={(value) =>
											form.setValue(
												"status",
												value as "draft" | "active" | "archived",
											)
										}
									>
										<SelectTrigger id="status" className="w-full">
											<SelectValue placeholder="Selecione o status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="draft">
												<div className="flex items-center gap-2">
													<span className="size-2 rounded-full bg-yellow-500" />
													Rascunho
												</div>
											</SelectItem>
											<SelectItem value="active">
												<div className="flex items-center gap-2">
													<span className="size-2 rounded-full bg-emerald-500" />
													Ativo
												</div>
											</SelectItem>
											<SelectItem value="archived">
												<div className="flex items-center gap-2">
													<span className="size-2 rounded-full bg-gray-500" />
													Arquivado
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<div className="flex size-5 items-center justify-center rounded bg-purple-100 dark:bg-purple-900/30">
										<span className="text-purple-600 dark:text-purple-400 text-xs font-semibold">
											⚖
										</span>
									</div>
									<Label className="text-sm font-semibold">
										Dimensões e Peso
									</Label>
								</div>

								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="weight" className="text-xs">
											Peso (gramas)
										</Label>
										<div className="relative">
											<Input
												id="weight"
												type="number"
												step="1"
												placeholder="0"
												{...form.register("weight")}
												className="pr-10"
											/>
											<span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-xs">
												g
											</span>
										</div>
										<p className="text-muted-foreground text-xs">
											Usado para cálculos de frete
										</p>
									</div>

									<div className="grid grid-cols-3 gap-3">
										<div className="space-y-2">
											<Label htmlFor="height" className="text-xs">
												Altura (cm)
											</Label>
											<div className="relative">
												<Input
													id="height"
													type="number"
													step="0.1"
													placeholder="0"
													{...form.register("height")}
													className="pr-8"
												/>
												<span className="text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 text-xs">
													cm
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="width" className="text-xs">
												Largura (cm)
											</Label>
											<div className="relative">
												<Input
													id="width"
													type="number"
													step="0.1"
													placeholder="0"
													{...form.register("width")}
													className="pr-8"
												/>
												<span className="text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 text-xs">
													cm
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="length" className="text-xs">
												Comprimento (cm)
											</Label>
											<div className="relative">
												<Input
													id="length"
													type="number"
													step="0.1"
													placeholder="0"
													{...form.register("length")}
													className="pr-8"
												/>
												<span className="text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 text-xs">
													cm
												</span>
											</div>
										</div>
									</div>
									<p className="text-muted-foreground text-xs">
										Dimensões do produto para embalagem e envio
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Submit Actions */}
					<div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t bg-background/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-background/60">
						<Button type="button" variant="outline" asChild>
							<Link to="/$store/products" params={{ store }}>
								Cancelar
							</Link>
						</Button>
						<Button
							type="submit"
							className="min-w-[140px]"
							disabled={isPending || isLoadingProduct}
						>
							{isPending
								? "Salvando..."
								: isEditMode
									? "Atualizar Produto"
									: "Salvar Produto"}
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
