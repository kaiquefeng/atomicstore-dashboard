"use client";

import {
	IconArrowLeft,
	IconCamera,
	IconChevronLeft,
	IconChevronRight,
	IconEdit,
	IconLoader,
	IconPlus,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { FormProvider } from "react-hook-form";
import { ProductBasicInfo } from "@/components/products/product-basic-info";
import { ProductImagesUpload } from "@/components/products/product-images-upload";
import { VariantValueInput } from "@/components/products/variant-value-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	VideoPreviewModal,
	VideoThumbnail,
} from "@/components/video-preview-modal";
import type { ProductVariant as ApiProductVariant } from "@/features/products/adapters/create-product.adapter";
import { useCreateProduct } from "@/features/products/hooks/use-create-product";
import { useProductById } from "@/features/products/hooks/use-product-by-id";
import { useProductForm } from "@/features/products/hooks/use-product-form";
import { useUpdateProduct } from "@/features/products/hooks/use-update-product";
import type {
	ProductFormData,
	ProductVariant,
	VideoItem,
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

	// Transform product data to form data when editing
	const initialFormData = React.useMemo(() => {
		if (isEditMode && productData) {
			return transformProductDataToFormData(productData);
		}
		return undefined;
	}, [isEditMode, productData]);

	// Use the new product form hook
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

	// Watch form values for status badge and title
	const status = form.watch("status");
	const title = form.watch("title");

	// State for image picker drawer
	const [imagePickerVariantId, setImagePickerVariantId] = React.useState<
		string | null
	>(null);

	// State for variant edit drawer
	const [editVariantId, setEditVariantId] = React.useState<string | null>(null);

	const [previewVideo, setPreviewVideo] = React.useState<VideoItem | null>(
		null,
	);
	const videoInputRef = React.useRef<HTMLInputElement>(null);

	// Update images when initial data changes
	React.useEffect(() => {
		if (initialFormData?.productImages) {
			images.setImages(initialFormData.productImages);
		}
	}, [initialFormData?.productImages, images.setImages]);

	// Update variants when initial data changes
	React.useEffect(() => {
		if (initialFormData?.productVariants) {
			setProductVariants(initialFormData.productVariants);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialFormData?.productVariants, setProductVariants]);

	// Update variant options when initial data changes
	React.useEffect(() => {
		if (initialFormData?.variantOptions) {
			setVariantOptions(initialFormData.variantOptions);
		}
	}, [initialFormData?.variantOptions, setVariantOptions]);

	// Update videos when initial data changes
	React.useEffect(() => {
		if (initialFormData?.categoryVideos) {
			setCategoryVideos(initialFormData.categoryVideos);
		}
	}, [initialFormData?.categoryVideos, setCategoryVideos]);

	// Gerar SKU e barcode automaticamente quando o título mudar (apenas para variações sem SKU/barcode)
	React.useEffect(() => {
		if (title?.trim() && productVariants.length > 0) {
			setProductVariants((prev) =>
				prev.map((variant, index) => {
					const updates: Partial<ProductVariant> = {};

					// Só atualiza SKU se estiver vazio
					if (!variant.sku || variant.sku.trim() === "") {
						updates.sku = generateSKU(title, index);
					}

					// Só atualiza barcode se estiver vazio
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
		// Converter estoque e dimensões do formulário para o formato esperado pela API
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

		// Converter variantOptions para properties no formato esperado pela API
		const properties = variantOptions
			.filter((option) => option.values.length > 0)
			.map((option) => ({
				title: option.name,
				options: option.values,
			}));

		// Filtrar apenas imagens com arquivo (novas imagens para upload)
		const imageFiles = images.images
			.filter((img) => img.file !== null)
			.map((img) => img.file as File);

		// Obter referências das imagens existentes (sem arquivo)
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

		// Validar que há pelo menos uma variação
		if (productVariants.length === 0) {
			throw new Error(
				"É necessário criar pelo menos uma variação com SKU, Preço e Código de barras",
			);
		}

		// Converter productVariants para o formato de variants esperado pela API
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

			// Remover campos undefined
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

		// Garantir que pelo menos uma variant tenha isDefault: true
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
					{/* Basic Information */}
					<ProductBasicInfo />

					{/* Imagens do Produto */}
					<ProductImagesUpload
						images={images.images}
						onAddImages={images.addImages}
						onRemoveImage={images.removeImage}
					/>

					{/* Video Thumbnails Cover */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
									3
								</span>
								Video Thumbnails Cover
							</CardTitle>
							<CardDescription>
								Add product videos to showcase features and tutorials
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Hidden file input for video upload */}
							<input
								type="file"
								ref={videoInputRef}
								onChange={(e) => {
									if (e.target.files) {
										handleVideoFileInput(Array.from(e.target.files));
									}
								}}
								accept="video/*"
								multiple
								className="hidden"
							/>

							{/* Video Grid */}
							<div className="rounded-xl border bg-muted/30 p-4">
								<div className="flex flex-wrap gap-3">
									{/* Video Thumbnails */}
									{categoryVideos.map((video) => (
										<VideoThumbnail
											key={video.id}
											videoUrl={video.url}
											thumbnail={video.thumbnail}
											title={video.title}
											onRemove={() => removeVideoItem(video.id)}
											onPreview={() => setPreviewVideo(video)}
										/>
									))}

									{/* Add Video Button */}
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												type="button"
												variant="outline"
												onClick={() => videoInputRef.current?.click()}
												className="aspect-4/5 w-28 h-auto shrink-0 flex-col gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
											>
												<IconPlus className="size-6 text-primary" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Add video</TooltipContent>
									</Tooltip>
								</div>
							</div>

							<p className="text-muted-foreground text-xs">
								Click on a video to preview. Supports YouTube, Vimeo, or upload
								video files directly.
							</p>
						</CardContent>
					</Card>

					{/* Video Preview Modal */}
					<VideoPreviewModal
						isOpen={!!previewVideo}
						onClose={() => setPreviewVideo(null)}
						videoUrl={previewVideo?.url || ""}
						title={previewVideo?.title || ""}
						thumbnail={previewVideo?.thumbnail}
					/>

					{/* Variações (Variants) */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
									4
								</span>
								Variações
							</CardTitle>
							<CardDescription>
								Configure as propriedades e variações do produto
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Propriedades Section */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base font-semibold">
										Propriedades
									</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addVariantOption}
									>
										<IconPlus className="size-4 mr-1" />
										Adicionar Propriedade
									</Button>
								</div>

								{variantOptions.length === 0 ? (
									<div className="rounded-lg border border-dashed p-6 text-center">
										<p className="text-muted-foreground text-sm">
											Adicione propriedades como Cor, Tamanho, Material, etc.
										</p>
									</div>
								) : (
									<div className="space-y-4">
										{variantOptions.map((option) => (
											<div key={option.id} className="space-y-2">
												<div className="flex items-center justify-between">
													<Select
														value={option.name}
														onValueChange={(value) =>
															updateVariantOption(option.id, { name: value })
														}
													>
														<SelectTrigger className="w-32 h-8">
															<SelectValue placeholder="Tipo" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="Color">Cor</SelectItem>
															<SelectItem value="Size">Tamanho</SelectItem>
															<SelectItem value="Material">Material</SelectItem>
															<SelectItem value="Style">Estilo</SelectItem>
															<SelectItem value="Weight">Peso</SelectItem>
														</SelectContent>
													</Select>
													<Button
														type="button"
														variant="ghost"
														size="icon-sm"
														className="text-muted-foreground hover:text-destructive"
														onClick={() => removeVariantOption(option.id)}
													>
														<IconTrash className="size-4" />
													</Button>
												</div>
												<div className="flex flex-wrap items-center gap-2">
													{option.values.map((value, valueIndex) => (
														<Badge
															key={`${option.id}-${value}`}
															variant="secondary"
															className="px-3 py-1.5 text-sm font-normal gap-1.5 bg-muted hover:bg-muted"
														>
															{value}
															<button
																type="button"
																onClick={() =>
																	removeValueFromVariant(option.id, valueIndex)
																}
																className="ml-1 hover:text-destructive"
															>
																<IconX className="size-3.5" />
															</button>
														</Badge>
													))}
													<VariantValueInput
														optionName={option.name}
														onAdd={(value) =>
															addValueToVariant(option.id, value)
														}
													/>
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Generate Variants Button */}
							{variantOptions.length > 0 &&
								variantOptions.some((o) => o.values.length > 0) && (
									<div className="flex justify-end">
										<Button
											type="button"
											variant="secondary"
											size="sm"
											onClick={generateVariantsFromOptions}
										>
											<IconPlus className="size-4 mr-1" />
											Gerar Variações
										</Button>
									</div>
								)}

							<Separator />

							{/* Variação Table */}
							<div className="space-y-3">
								<Label className="text-base font-semibold">Variação</Label>

								{productVariants.length === 0 ? (
									<div className="rounded-lg border border-dashed p-8 text-center">
										<div className="flex size-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
											<IconPlus className="size-6 text-muted-foreground" />
										</div>
										<p className="text-muted-foreground text-sm mb-3">
											Nenhuma variação configurada. Adicione propriedades acima
											e clique em "Gerar Variações".
										</p>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={addProductVariant}
										>
											<IconPlus className="size-4 mr-1" />
											Adicionar Manualmente
										</Button>
									</div>
								) : (
									<div className="rounded-lg border overflow-hidden">
										{/* Table Header */}
										<div className="grid grid-cols-[1fr_120px_120px_120px_60px] gap-3 px-4 py-3 bg-muted/50 border-b text-sm font-medium text-muted-foreground">
											<span>Variação</span>
											<span>Estoque</span>
											<span>Preço</span>
											<span>Peso</span>
											<span>Ações</span>
										</div>

										{/* Table Body */}
										<div className="divide-y">
											{productVariants.map((variant) => {
												// Use selected image or fall back to principal (first) image
												const selectedImage = variant.imageId
													? images.images.find(
															(img) => img.id === variant.imageId,
														)
													: images.images[0]; // Default to principal image

												return (
													<div
														key={variant.id}
														className="grid grid-cols-[1fr_120px_120px_120px_60px] gap-3 px-4 py-3 items-center hover:bg-muted/30 transition-colors"
													>
														{/* Variant Name with Image Selector */}
														<div className="flex items-center gap-3">
															{/* Image Thumbnail - Click to open drawer */}
															<button
																type="button"
																onClick={() =>
																	setImagePickerVariantId(variant.id)
																}
																className="size-14 rounded-lg border-2 border-muted-foreground/30 bg-muted flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
															>
																{selectedImage ? (
																	<img
																		src={selectedImage.preview}
																		alt={variant.title}
																		className="size-full object-cover"
																	/>
																) : (
																	<IconCamera className="size-5 text-muted-foreground/50" />
																)}
															</button>
															{/* Variant Title */}
															<span className="font-medium text-primary">
																{variant.title || "Sem título"}
															</span>
														</div>

														{/* Stock Input */}
														<div className="relative">
															<Input
																type="text"
																placeholder="∞"
																value={variant.stock || ""}
																onChange={(e) =>
																	updateProductVariant(variant.id, {
																		stock: e.target.value,
																	})
																}
																className="h-9 text-center"
															/>
														</div>

														{/* Price Input */}
														<div className="relative">
															<span className="text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 text-xs">
																R$
															</span>
															<Input
																type="number"
																step="0.01"
																placeholder="0.00"
																value={variant.priceBrl}
																onChange={(e) =>
																	updateProductVariant(variant.id, {
																		priceBrl: e.target.value,
																	})
																}
																className="h-9 pl-8"
															/>
														</div>

														{/* Weight Input */}
														<div className="relative">
															<Input
																type="number"
																step="0.1"
																placeholder="0.0"
																value={variant.weightKg || ""}
																onChange={(e) =>
																	updateProductVariant(variant.id, {
																		weightKg: e.target.value,
																	})
																}
																className="h-9 pr-8"
															/>
															<span className="text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 text-xs">
																kg
															</span>
														</div>

														{/* Actions */}
														<div className="flex justify-center">
															<Tooltip>
																<TooltipTrigger asChild>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		className="size-9 rounded-full border"
																		onClick={() => setEditVariantId(variant.id)}
																	>
																		<IconEdit className="size-4" />
																	</Button>
																</TooltipTrigger>
																<TooltipContent>Editar variação</TooltipContent>
															</Tooltip>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								)}
							</div>

							{/* Summary */}
							{productVariants.length > 0 && (
								<div className="flex items-center justify-between pt-2">
									<div className="text-sm text-muted-foreground">
										<span className="font-medium text-foreground">
											{productVariants.length}
										</span>{" "}
										variação{productVariants.length > 1 ? "ões" : ""}{" "}
										configurada
										{productVariants.length > 1 ? "s" : ""}
									</div>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="text-destructive hover:text-destructive"
										onClick={() => setProductVariants([])}
									>
										<IconTrash className="size-4 mr-1" />
										Limpar Todas
									</Button>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Image Picker Drawer */}
					<Drawer
						open={!!imagePickerVariantId}
						onOpenChange={(open) => {
							if (!open) setImagePickerVariantId(null);
						}}
					>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>Selecionar Imagem</DrawerTitle>
								<DrawerDescription>
									{imagePickerVariantId &&
										(() => {
											const variant = productVariants.find(
												(v) => v.id === imagePickerVariantId,
											);
											return variant
												? `Escolha uma imagem para: ${variant.title || "Variação"}`
												: "Escolha uma imagem para esta variação";
										})()}
								</DrawerDescription>
							</DrawerHeader>

							<div className="px-4 pb-4">
								{images.images.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<IconCamera className="size-12 text-muted-foreground/50 mb-4" />
										<p className="text-muted-foreground">
											Nenhuma imagem disponível.
										</p>
										<p className="text-muted-foreground text-sm">
											Adicione imagens na seção "Imagens do Produto".
										</p>
									</div>
								) : (
									<div className="grid grid-cols-3 gap-3">
										{images.images.map((img, imgIndex) => {
											const currentVariant = productVariants.find(
												(v) => v.id === imagePickerVariantId,
											);
											const isSelected =
												currentVariant?.imageId === img.id ||
												(!currentVariant?.imageId && imgIndex === 0);

											return (
												<button
													key={img.id}
													type="button"
													onClick={() => {
														if (imagePickerVariantId) {
															updateProductVariant(imagePickerVariantId, {
																imageId: img.id,
															});
															setImagePickerVariantId(null);
														}
													}}
													className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all cursor-pointer hover:scale-[1.02] ${
														isSelected
															? "border-primary ring-4 ring-primary/30"
															: "border-transparent hover:border-primary/50"
													}`}
												>
													<img
														src={img.preview}
														alt={img.name}
														className="size-full object-cover"
													/>
													{imgIndex === 0 && (
														<Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
															Principal
														</Badge>
													)}
													{isSelected && (
														<div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
															<div className="size-8 rounded-full bg-primary flex items-center justify-center">
																<IconX className="size-5 text-primary-foreground rotate-45" />
															</div>
														</div>
													)}
													<div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/70 to-transparent p-2">
														<p className="text-white text-xs truncate">
															{img.name}
														</p>
													</div>
												</button>
											);
										})}
									</div>
								)}
							</div>

							<DrawerFooter>
								<DrawerClose asChild>
									<Button variant="outline">Cancelar</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>

					{/* Variant Edit Drawer */}
					<Drawer
						direction="right"
						open={!!editVariantId}
						onOpenChange={(open) => {
							if (!open) setEditVariantId(null);
						}}
					>
						<DrawerContent className="h-full w-full max-w-md ml-auto">
							{(() => {
								const editingVariant = productVariants.find(
									(v) => v.id === editVariantId,
								);
								const currentIndex = productVariants.findIndex(
									(v) => v.id === editVariantId,
								);
								const prevVariant =
									currentIndex > 0 ? productVariants[currentIndex - 1] : null;
								const nextVariant =
									currentIndex < productVariants.length - 1
										? productVariants[currentIndex + 1]
										: null;

								if (!editingVariant) return null;

								// Calculate margin
								const cost = Number(editingVariant.costBrl) || 0;
								const price = Number(editingVariant.priceBrl) || 0;
								const margin =
									price > 0 ? Math.round(((price - cost) / price) * 100) : 0;

								return (
									<>
										<DrawerHeader className="border-b">
											<div className="flex items-center justify-between">
												<DrawerClose asChild>
													<Button variant="ghost" size="icon">
														<IconChevronLeft className="size-5" />
													</Button>
												</DrawerClose>
												<DrawerTitle className="text-xl font-bold">
													{editingVariant.title || "Variação"}
												</DrawerTitle>
												<div className="flex items-center gap-1">
													<Button
														variant="ghost"
														size="icon"
														disabled={!prevVariant}
														onClick={() =>
															prevVariant && setEditVariantId(prevVariant.id)
														}
													>
														<IconChevronLeft className="size-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														disabled={!nextVariant}
														onClick={() =>
															nextVariant && setEditVariantId(nextVariant.id)
														}
													>
														<IconChevronRight className="size-4" />
													</Button>
												</div>
											</div>
										</DrawerHeader>

										<div className="flex-1 overflow-y-auto p-4 space-y-6">
											{/* Preços Section */}
											<Card>
												<CardHeader className="pb-4">
													<CardTitle className="text-lg">Preços</CardTitle>
												</CardHeader>
												<CardContent className="space-y-4">
													<div className="grid grid-cols-2 gap-4">
														<div className="space-y-2">
															<Label className="text-sm">Preço de venda</Label>
															<div className="relative">
																<span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
																	R$
																</span>
																<Input
																	type="number"
																	step="0.01"
																	placeholder="0.00"
																	value={editingVariant.priceBrl}
																	onChange={(e) =>
																		updateProductVariant(editingVariant.id, {
																			priceBrl: e.target.value,
																		})
																	}
																	className="pl-10"
																/>
															</div>
														</div>
														<div className="space-y-2">
															<Label className="text-sm">
																Preço promocional
															</Label>
															<div className="relative">
																<span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
																	R$
																</span>
																<Input
																	type="number"
																	step="0.01"
																	placeholder="0.00"
																	value={editingVariant.compareAtBrl}
																	onChange={(e) =>
																		updateProductVariant(editingVariant.id, {
																			compareAtBrl: e.target.value,
																		})
																	}
																	className="pl-10"
																/>
															</div>
														</div>
													</div>

													<div className="flex items-center gap-2">
														<Checkbox
															id="show-price"
															checked={editingVariant.showPrice}
															onCheckedChange={(checked) =>
																updateProductVariant(editingVariant.id, {
																	showPrice: !!checked,
																})
															}
														/>
														<Label htmlFor="show-price" className="text-sm">
															Exibir o preço na loja
														</Label>
													</div>

													<div className="grid grid-cols-2 gap-4">
														<div className="space-y-2">
															<Label className="text-sm">Custo</Label>
															<div className="relative">
																<span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
																	R$
																</span>
																<Input
																	type="number"
																	step="0.01"
																	placeholder="0.00"
																	value={editingVariant.costBrl}
																	onChange={(e) =>
																		updateProductVariant(editingVariant.id, {
																			costBrl: e.target.value,
																		})
																	}
																	className="pl-10"
																/>
															</div>
														</div>
														<div className="space-y-2">
															<div className="flex items-center gap-1">
																<Label className="text-sm">
																	Margem de lucro
																</Label>
																<Tooltip>
																	<TooltipTrigger>
																		<span className="text-muted-foreground text-xs cursor-help">
																			ⓘ
																		</span>
																	</TooltipTrigger>
																	<TooltipContent>
																		Calculado automaticamente com base no preço
																		e custo
																	</TooltipContent>
																</Tooltip>
															</div>
															<Input
																type="text"
																value={`${margin} %`}
																disabled
																className="bg-muted"
															/>
														</div>
													</div>

													<p className="text-muted-foreground text-xs">
														É para uso interno, os seus clientes não o verão na
														loja.
													</p>
												</CardContent>
											</Card>

											{/* Códigos Section */}
											<Card>
												<CardHeader className="pb-4">
													<CardTitle className="text-lg">Códigos</CardTitle>
												</CardHeader>
												<CardContent className="space-y-4">
													<div className="space-y-2">
														<Label className="text-sm">SKU</Label>
														<Input
															placeholder="SENDIT-BP-2026"
															value={editingVariant.sku}
															onChange={(e) =>
																updateProductVariant(editingVariant.id, {
																	sku: e.target.value,
																})
															}
														/>
														<p className="text-muted-foreground text-xs">
															SKU é um código que você cria internamente para
															ter o controle dos seus produtos com variações.
														</p>
													</div>

													<div className="space-y-2">
														<Label className="text-sm">Código de barras</Label>
														<Input
															placeholder=""
															value={editingVariant.barcode}
															onChange={(e) =>
																updateProductVariant(editingVariant.id, {
																	barcode: e.target.value,
																})
															}
														/>
														<p className="text-muted-foreground text-xs">
															O código de barras é composto por 13 números e
															serve para identificar um produto.
														</p>
													</div>
												</CardContent>
											</Card>

											{/* Peso e dimensões Section */}
											<Card>
												<CardHeader className="pb-4">
													<CardTitle className="text-lg">
														Peso e dimensões
													</CardTitle>
													<CardDescription>
														Preencha os dados para calcular o custo de envio dos
														produtos e mostrar os meios de envio na sua loja.
													</CardDescription>
												</CardHeader>
												<CardContent className="space-y-4">
													<div className="grid grid-cols-2 gap-4">
														<div className="space-y-2">
															<Label className="text-sm">Peso</Label>
															<div className="relative">
																<Input
																	type="number"
																	step="0.001"
																	placeholder="0.000"
																	value={editingVariant.weightKg}
																	onChange={(e) =>
																		updateProductVariant(editingVariant.id, {
																			weightKg: e.target.value,
																		})
																	}
																	className="pr-10"
																/>
																<span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
																	kg
																</span>
															</div>
														</div>
														<div className="space-y-2">
															<Label className="text-sm">Comprimento</Label>
															<div className="relative">
																<Input
																	type="number"
																	step="0.01"
																	placeholder="0.00"
																	value={editingVariant.lengthCm}
																	onChange={(e) =>
																		updateProductVariant(editingVariant.id, {
																			lengthCm: e.target.value,
																		})
																	}
																	className="pr-10"
																/>
																<span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
																	cm
																</span>
															</div>
														</div>
													</div>

													<div className="grid grid-cols-2 gap-4">
														<div className="space-y-2">
															<Label className="text-sm">Largura</Label>
															<div className="relative">
																<Input
																	type="number"
																	step="0.01"
																	placeholder="0.00"
																	value={editingVariant.widthCm}
																	onChange={(e) =>
																		updateProductVariant(editingVariant.id, {
																			widthCm: e.target.value,
																		})
																	}
																	className="pr-10"
																/>
																<span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
																	cm
																</span>
															</div>
														</div>
														<div className="space-y-2">
															<Label className="text-sm">Altura</Label>
															<div className="relative">
																<Input
																	type="number"
																	step="0.01"
																	placeholder="0.00"
																	value={editingVariant.heightCm}
																	onChange={(e) =>
																		updateProductVariant(editingVariant.id, {
																			heightCm: e.target.value,
																		})
																	}
																	className="pr-10"
																/>
																<span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
																	cm
																</span>
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										</div>

										<DrawerFooter className="border-t">
											<DrawerClose asChild>
												<Button disabled={isPending}>
													{isPending ? "Salvando..." : "Salvar"}
												</Button>
											</DrawerClose>
										</DrawerFooter>
									</>
								);
							})()}
						</DrawerContent>
					</Drawer>

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
							{/* Stock & Status */}
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

							{/* Dimensions & Weight Section */}
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
