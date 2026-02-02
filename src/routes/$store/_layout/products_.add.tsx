"use client";

import {
	IconArrowLeft,
	IconCamera,
	IconChevronLeft,
	IconChevronRight,
	IconEdit,
	IconPlus,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";

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
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	VideoPreviewModal,
	VideoThumbnail,
} from "@/components/video-preview-modal";

export const Route = createFileRoute("/$store/_layout/products_/add")({
	component: AddProductPage,
});

function VariantValueInput({
	optionName,
	onAdd,
}: {
	optionName: string;
	onAdd: (value: string) => void;
}) {
	const [value, setValue] = React.useState("");
	const [isAdding, setIsAdding] = React.useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (value.trim()) {
			onAdd(value.trim());
			setValue("");
			setIsAdding(false);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Escape") {
			setValue("");
			setIsAdding(false);
		}
	}

	if (!isAdding) {
		return (
			<Button
				type="button"
				variant="outline"
				size="xs"
				onClick={() => setIsAdding(true)}
				className="border-dashed"
			>
				<IconPlus className="size-3" />
				Add
			</Button>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex items-center gap-1">
			<Input
				autoFocus
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={() => {
					if (!value.trim()) setIsAdding(false);
				}}
				placeholder={
					optionName === "Size"
						? "e.g., XL"
						: optionName === "Color"
							? "e.g., Red"
							: "Value"
				}
				className="h-6 w-20 px-2 text-xs"
			/>
		</form>
	);
}

interface ProductImage {
	id: string;
	file: File | null;
	preview: string;
	name: string;
}

interface VariantOption {
	id: string;
	name: string;
	values: string[];
}

interface ProductVariant {
	id: string;
	sku: string;
	priceBrl: string;
	compareAtBrl: string;
	costBrl: string;
	title: string;
	barcode: string;
	isDefault: boolean;
	stock: string;
	showPrice: boolean;
	weightKg: string;
	lengthCm: string;
	widthCm: string;
	heightCm: string;
	imageId?: string; // Reference to product image ID
	metadata: {
		size?: string;
		color?: string;
		[key: string]: string | undefined;
	};
}

interface VideoItem {
	id: string;
	url: string;
	title: string;
	thumbnail?: string;
}

function AddProductPage() {
	// const navigate = useNavigate();
	const { store } = Route.useParams();

	const [title, setTitle] = React.useState("Camiseta Básica");
	const [description, setDescription] = React.useState(
		"Camiseta básica de algodão 100%. Confortável e versátil, perfeita para o dia a dia.",
	);
	const [category, setCategory] = React.useState("clothing");
	const [stock, setStock] = React.useState("150");
	const [weight, setWeight] = React.useState("150");
	const [height, setHeight] = React.useState("50");
	const [width, setWidth] = React.useState("250");
	const [length, setLength] = React.useState("300");
	const [status, setStatus] = React.useState("active");
	const [tags, setTags] = React.useState("camiseta, básica, algodão, casual");

	// Product variants with individual pricing
	const [productVariants, setProductVariants] = React.useState<
		ProductVariant[]
	>([]);

	const [productImages, setProductImages] = React.useState<ProductImage[]>([
		{
			id: "1",
			file: null,
			preview:
				"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
			name: "Front View",
		},
		{
			id: "2",
			file: null,
			preview:
				"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop",
			name: "Back View",
		},
		{
			id: "3",
			file: null,
			preview:
				"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop",
			name: "Detail Shot",
		},
	]);

	const [variantOptions, setVariantOptions] = React.useState<VariantOption[]>([
		{ id: "1", name: "Color", values: ["Amarelo", "Azul", "Azul claro"] },
		{ id: "2", name: "Size", values: ["PP", "P", "M"] },
	]);

	// State for image picker drawer
	const [imagePickerVariantId, setImagePickerVariantId] = React.useState<
		string | null
	>(null);

	// State for variant edit drawer
	const [editVariantId, setEditVariantId] = React.useState<string | null>(null);

	const [categoryVideos, setCategoryVideos] = React.useState<VideoItem[]>([
		{
			id: "1",
			url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
			title: "Product Overview",
			thumbnail:
				"https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=400&fit=crop",
		},
		{
			id: "2",
			url: "https://youtube.com/watch?v=jNQXAC9IVRw",
			title: "How to Use",
			thumbnail:
				"https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=400&fit=crop",
		},
	]);

	const [previewVideo, setPreviewVideo] = React.useState<VideoItem | null>(
		null,
	);
	const videoInputRef = React.useRef<HTMLInputElement>(null);

	const [isDragging, setIsDragging] = React.useState(false);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	function handleDragOver(e: React.DragEvent) {
		e.preventDefault();
		setIsDragging(true);
	}

	function handleDragLeave(e: React.DragEvent) {
		e.preventDefault();
		setIsDragging(false);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setIsDragging(false);

		const files = Array.from(e.dataTransfer.files);
		handleFiles(files);
	}

	function handleFiles(files: File[]) {
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));

		const newVariants: ProductImage[] = imageFiles.map((file, index) => ({
			id: `${Date.now()}-${index}`,
			file,
			preview: URL.createObjectURL(file),
			name: file.name.split(".")[0],
		}));

		setProductImages((prev) => [...prev, ...newVariants]);
	}

	function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			handleFiles(Array.from(e.target.files));
		}
	}

	function removeProductImage(id: string) {
		setProductImages((prev) => prev.filter((v) => v.id !== id));
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

	function handleVideoFileInput(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			const videoFiles = files.filter((file) => file.type.startsWith("video/"));

			const newVideos: VideoItem[] = videoFiles.map((file, index) => ({
				id: `${Date.now()}-${index}`,
				url: URL.createObjectURL(file),
				title: file.name.split(".")[0],
				thumbnail: undefined,
			}));

			setCategoryVideos((prev) => [...prev, ...newVideos]);
		}
	}

	function removeVideoItem(id: string) {
		setCategoryVideos((prev) => prev.filter((v) => v.id !== id));
	}

	// Product Variant Management
	function addProductVariant() {
		const newVariant: ProductVariant = {
			id: `${Date.now()}`,
			sku: "",
			priceBrl: "",
			compareAtBrl: "",
			costBrl: "",
			title: `Nova Variação ${productVariants.length + 1}`,
			barcode: "",
			isDefault: productVariants.length === 0,
			stock: "",
			showPrice: true,
			weightKg: "",
			lengthCm: "",
			widthCm: "",
			heightCm: "",
			metadata: {},
		};
		setProductVariants((prev) => [...prev, newVariant]);
	}

	function updateProductVariant(id: string, updates: Partial<ProductVariant>) {
		setProductVariants((prev) =>
			prev.map((v) => (v.id === id ? { ...v, ...updates } : v)),
		);
	}

	// @ts-expect-error - id is a string
	function removeProductVariant(id: string) {
		setProductVariants((prev) => {
			const filtered = prev.filter((v) => v.id !== id);
			// If we removed the default variant, make the first one default
			if (filtered.length > 0 && !filtered.some((v) => v.isDefault)) {
				filtered[0].isDefault = true;
			}
			return filtered;
		});
	}

	// @ts-expect-error - id is a string
	function setDefaultVariant(id: string) {
		setProductVariants((prev) =>
			prev.map((v) => ({
				...v,
				isDefault: v.id === id,
			})),
		);
	}

	// @ts-expect-error - id is a string
	function updateVariantMetadata(id: string, key: string, value: string) {
		setProductVariants((prev) =>
			prev.map((v) =>
				v.id === id ? { ...v, metadata: { ...v.metadata, [key]: value } } : v,
			),
		);
	}

	// Generate variant combinations based on variant options
	function generateVariantsFromOptions() {
		if (variantOptions.length === 0) return;

		const colorOption = variantOptions.find((o) => o.name === "Color");
		const sizeOption = variantOptions.find((o) => o.name === "Size");

		const newVariants: ProductVariant[] = [];
		let counter = 1;

		if (colorOption && sizeOption) {
			for (const color of colorOption.values) {
				for (const size of sizeOption.values) {
					newVariants.push({
						id: `${Date.now()}-${counter}`,
						sku: "",
						priceBrl: "",
						compareAtBrl: "",
						costBrl: "",
						title: `${color} ${size}`,
						barcode: "",
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
						sku: "",
						priceBrl: "",
						compareAtBrl: "",
						costBrl: "",
						title: value,
						barcode: "",
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
			setProductVariants(newVariants.slice(0, 50)); // Limit to 50 variants
		}
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		// toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
		// 	loading: "Saving product...",
		// 	success: () => {
		// 		navigate({ to: "/$store/products", params: { store } });
		// 		return "Product saved successfully!";
		// 	},
		// 	error: "Failed to save product",
		// });
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
					<h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
					<p className="text-muted-foreground text-sm">
						Create a new product listing for your store
					</p>
				</div>
				<Badge
					variant="outline"
					className="text-emerald-600 border-emerald-200 bg-emerald-50"
				>
					Draft
				</Badge>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
								1
							</span>
							Basic Information
						</CardTitle>
						<CardDescription>
							Start with the essential details about your product
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">Product Title</Label>
							<Input
								id="title"
								placeholder="e.g., Send It Premium Backpack"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="text-lg font-medium"
							/>
							<p className="text-muted-foreground text-xs">
								Choose a title that clearly describes your product
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Describe your product in detail..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="min-h-[160px] resize-y"
							/>
							<p className="text-muted-foreground text-xs">
								Include key features, materials, dimensions, and use cases
							</p>
						</div>

						<Separator />

						<div className="space-y-2">
							<Label htmlFor="category">Category</Label>
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger id="category" className="w-full">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="bags">Bags & Backpacks</SelectItem>
									<SelectItem value="electronics">Electronics</SelectItem>
									<SelectItem value="clothing">Clothing</SelectItem>
									<SelectItem value="accessories">Accessories</SelectItem>
									<SelectItem value="outdoor">Outdoor & Adventure</SelectItem>
									<SelectItem value="home">Home & Living</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="tags">Tags</Label>
							<Input
								id="tags"
								placeholder="adventure, travel, backpack"
								value={tags}
								onChange={(e) => setTags(e.target.value)}
							/>
							<p className="text-muted-foreground text-xs">
								Separate tags with commas for better discoverability
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Imagens do Produto */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
								2
							</span>
							Imagens do Produto
						</CardTitle>
						<CardDescription>
							Adicione imagens padrão do produto que podem ser usadas nas
							variações
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Hidden file input */}
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileInput}
							accept="image/*"
							multiple
							className="hidden"
						/>

						{/* Image Grid */}
						<section
							aria-label="Image upload area"
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<div className="flex flex-wrap gap-3">
								{/* Existing Images */}
								{productImages.map((image, index) => (
									<div
										key={image.id}
										className="group relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl border-2 border-transparent bg-muted shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
									>
										<img
											src={image.preview}
											alt={image.name}
											className="size-full object-cover transition-transform group-hover:scale-105"
										/>

										{/* Principal badge */}
										{index === 0 && (
											<div className="absolute left-1.5 top-1.5 z-10">
												<Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 shadow-sm">
													Principal
												</Badge>
											</div>
										)}

										{/* Hover overlay with delete */}
										<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="text-white hover:bg-white/20 hover:text-white"
														onClick={() => removeProductImage(image.id)}
													>
														<IconTrash className="size-5" />
														<span className="sr-only">Remover imagem</span>
													</Button>
												</TooltipTrigger>
												<TooltipContent>Remover imagem</TooltipContent>
											</Tooltip>
										</div>
									</div>
								))}

								{/* Add Image Button */}
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											type="button"
											variant="outline"
											onClick={() => fileInputRef.current?.click()}
											className={`aspect-square w-28 h-28 shrink-0 flex-col gap-2 rounded-xl border-2 border-dashed ${
												isDragging
													? "border-primary bg-primary/10 scale-105"
													: "border-muted-foreground/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
											}`}
										>
											<div className="flex size-10 items-center justify-center rounded-full bg-muted">
												<IconPlus className="size-5 text-muted-foreground" />
											</div>
										</Button>
									</TooltipTrigger>
									<TooltipContent>Adicionar imagem</TooltipContent>
								</Tooltip>
							</div>

							{isDragging && (
								<p className="mt-3 text-center text-sm text-primary font-medium">
									Solte as imagens aqui para enviar
								</p>
							)}
						</section>

						<p className="text-muted-foreground text-xs">
							Arraste para reordenar. A primeira imagem será a imagem principal
							do produto. Suporta PNG, JPG, WebP até 10MB.
						</p>
					</CardContent>
				</Card>

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
							onChange={handleVideoFileInput}
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
								<Label className="text-base font-semibold">Propriedades</Label>
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
													onAdd={(value) => addValueToVariant(option.id, value)}
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
										Nenhuma variação configurada. Adicione propriedades acima e
										clique em "Gerar Variações".
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
												? productImages.find(
														(img) => img.id === variant.imageId,
													)
												: productImages[0]; // Default to principal image

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
									variação{productVariants.length > 1 ? "ões" : ""} configurada
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
							{productImages.length === 0 ? (
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
									{productImages.map((img, imgIndex) => {
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
														<Label className="text-sm">Preço promocional</Label>
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
															<Label className="text-sm">Margem de lucro</Label>
															<Tooltip>
																<TooltipTrigger>
																	<span className="text-muted-foreground text-xs cursor-help">
																		ⓘ
																	</span>
																</TooltipTrigger>
																<TooltipContent>
																	Calculado automaticamente com base no preço e
																	custo
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
														SKU é um código que você cria internamente para ter
														o controle dos seus produtos com variações.
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
														O código de barras é composto por 13 números e serve
														para identificar um produto.
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
											<Button>Salvar</Button>
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
								<Label htmlFor="stock">Stock Quantity</Label>
								<Input
									id="stock"
									type="number"
									placeholder="0"
									value={stock}
									onChange={(e) => setStock(e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="status">Product Status</Label>
								<Select value={status} onValueChange={setStatus}>
									<SelectTrigger id="status" className="w-full">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="draft">
											<div className="flex items-center gap-2">
												<span className="size-2 rounded-full bg-yellow-500" />
												Draft
											</div>
										</SelectItem>
										<SelectItem value="active">
											<div className="flex items-center gap-2">
												<span className="size-2 rounded-full bg-emerald-500" />
												Active
											</div>
										</SelectItem>
										<SelectItem value="archived">
											<div className="flex items-center gap-2">
												<span className="size-2 rounded-full bg-gray-500" />
												Archived
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
									Dimensions & Weight
								</Label>
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="weight" className="text-xs">
										Weight (grams)
									</Label>
									<div className="relative">
										<Input
											id="weight"
											type="number"
											step="1"
											placeholder="0"
											value={weight}
											onChange={(e) => setWeight(e.target.value)}
											className="pr-10"
										/>
										<span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-xs">
											g
										</span>
									</div>
									<p className="text-muted-foreground text-xs">
										Used for shipping calculations
									</p>
								</div>

								<div className="grid grid-cols-3 gap-3">
									<div className="space-y-2">
										<Label htmlFor="height" className="text-xs">
											Height (cm)
										</Label>
										<div className="relative">
											<Input
												id="height"
												type="number"
												step="0.1"
												placeholder="0"
												value={height}
												onChange={(e) => setHeight(e.target.value)}
												className="pr-8"
											/>
											<span className="text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 text-xs">
												cm
											</span>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="width" className="text-xs">
											Width (cm)
										</Label>
										<div className="relative">
											<Input
												id="width"
												type="number"
												step="0.1"
												placeholder="0"
												value={width}
												onChange={(e) => setWidth(e.target.value)}
												className="pr-8"
											/>
											<span className="text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 text-xs">
												cm
											</span>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="length" className="text-xs">
											Length (cm)
										</Label>
										<div className="relative">
											<Input
												id="length"
												type="number"
												step="0.1"
												placeholder="0"
												value={length}
												onChange={(e) => setLength(e.target.value)}
												className="pr-8"
											/>
											<span className="text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 text-xs">
												cm
											</span>
										</div>
									</div>
								</div>
								<p className="text-muted-foreground text-xs">
									Product dimensions for packaging and shipping
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Submit Actions */}
				<div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t bg-background/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-background/60">
					<Button type="button" variant="outline" asChild>
						<Link to="/$store/products" params={{ store }}>
							Cancel
						</Link>
					</Button>
					<Button type="submit" className="min-w-[140px]">
						Save Product
					</Button>
				</div>
			</form>
		</div>
	);
}
