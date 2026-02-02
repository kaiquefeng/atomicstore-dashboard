"use client";

import {
	IconCamera,
	IconCheck,
	IconChevronLeft,
	IconChevronRight,
	IconCopy,
	IconDownload,
	IconExternalLink,
	IconFilter,
	IconSearch,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import imagesData from "@/constants/images-data.json";

export const Route = createFileRoute("/$store/_layout/images")({
	component: ImagesPage,
});

interface ProductImage {
	id: string;
	name: string;
	preview: string;
	productId: string;
	productName: string;
	isPrimary: boolean;
	size: number;
	dimensions: { width: number; height: number };
	uploadedAt: string;
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function ImageStats({ images }: { images: ProductImage[] }) {
	const totalSize = images.reduce((acc, img) => acc + img.size, 0);
	const uniqueProducts = new Set(images.map((img) => img.productId)).size;
	const primaryImages = images.filter((img) => img.isPrimary).length;

	return (
		<div className="grid gap-4 sm:grid-cols-4">
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Total de Imagens
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{images.length}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Produtos com Imagens
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{uniqueProducts}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Imagens Principais
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{primaryImages}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Espaço Usado
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
				</CardContent>
			</Card>
		</div>
	);
}

function ImageCard({
	image,
	isSelected,
	onSelect,
	onPreview,
	onDelete,
}: {
	image: ProductImage;
	isSelected: boolean;
	onSelect: () => void;
	onPreview: () => void;
	onDelete: () => void;
}) {
	return (
		<div
			className={`group relative aspect-square overflow-hidden rounded-xl border-2 bg-muted shadow-sm transition-all hover:shadow-md ${
				isSelected
					? "border-primary ring-2 ring-primary/30"
					: "border-transparent hover:border-primary/30"
			}`}
		>
			{/* Checkbox */}
			<div className="absolute left-2 top-2 z-20">
				<Checkbox
					checked={isSelected}
					onCheckedChange={onSelect}
					className="size-5 border-white bg-black/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
				/>
			</div>

			{/* Primary Badge */}
			{image.isPrimary && (
				<div className="absolute right-2 top-2 z-10">
					<Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 shadow-sm">
						Principal
					</Badge>
				</div>
			)}

			{/* Image */}
			<button
				type="button"
				onClick={onPreview}
				className="size-full cursor-pointer"
			>
				<img
					src={image.preview}
					alt={image.name}
					className="size-full object-cover transition-transform group-hover:scale-105"
				/>
			</button>

			{/* Hover Overlay */}
			<div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
				<div className="flex items-center justify-center gap-2 p-3">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8 text-white hover:bg-white/20 hover:text-white"
								onClick={onPreview}
							>
								<IconExternalLink className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Visualizar</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8 text-white hover:bg-white/20 hover:text-white"
								onClick={() => navigator.clipboard.writeText(image.preview)}
							>
								<IconCopy className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copiar URL</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8 text-white hover:bg-red-500/80 hover:text-white"
								onClick={onDelete}
							>
								<IconTrash className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Excluir</TooltipContent>
					</Tooltip>
				</div>
				<div className="px-3 pb-3">
					<p className="text-white text-xs font-medium truncate">
						{image.name}
					</p>
					<p className="text-white/70 text-[10px] truncate">
						{image.productName}
					</p>
				</div>
			</div>
		</div>
	);
}

function ImagePreviewDialog({
	image,
	open,
	onOpenChange,
	onDelete,
}: {
	image: ProductImage | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDelete: () => void;
}) {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = () => {
		if (image) {
			navigator.clipboard.writeText(image.preview);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	if (!image) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{image.name}
						{image.isPrimary && (
							<Badge className="bg-primary text-primary-foreground text-xs">
								Principal
							</Badge>
						)}
					</DialogTitle>
					<DialogDescription>Produto: {image.productName}</DialogDescription>
				</DialogHeader>

				<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
					<img
						src={image.preview}
						alt={image.name}
						className="size-full object-contain"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
					<div>
						<p className="text-muted-foreground">Dimensões</p>
						<p className="font-medium">
							{image.dimensions.width} x {image.dimensions.height}px
						</p>
					</div>
					<div>
						<p className="text-muted-foreground">Tamanho</p>
						<p className="font-medium">{formatFileSize(image.size)}</p>
					</div>
					<div>
						<p className="text-muted-foreground">Enviada em</p>
						<p className="font-medium">{formatDate(image.uploadedAt)}</p>
					</div>
					<div>
						<p className="text-muted-foreground">ID</p>
						<p className="font-medium font-mono text-xs">{image.id}</p>
					</div>
				</div>

				<DialogFooter className="flex-col gap-2 sm:flex-row">
					<Button variant="outline" onClick={handleCopy}>
						{copied ? (
							<>
								<IconCheck className="mr-1.5 size-4" />
								Copiado!
							</>
						) : (
							<>
								<IconCopy className="mr-1.5 size-4" />
								Copiar URL
							</>
						)}
					</Button>
					<Button variant="outline" asChild>
						<a href={image.preview} download target="_blank" rel="noreferrer">
							<IconDownload className="mr-1.5 size-4" />
							Download
						</a>
					</Button>
					<Button variant="destructive" onClick={onDelete}>
						<IconTrash className="mr-1.5 size-4" />
						Excluir
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function DeleteConfirmDialog({
	open,
	onOpenChange,
	onConfirm,
	count,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	count: number;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Excluir {count > 1 ? "imagens" : "imagem"}</DialogTitle>
					<DialogDescription>
						Tem certeza que deseja excluir{" "}
						{count > 1 ? `${count} imagens` : "esta imagem"}? Esta ação não pode
						ser desfeita.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						<IconTrash className="mr-1.5 size-4" />
						Excluir
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function ImagesPage() {
	const [images, setImages] = React.useState<ProductImage[]>(
		() => imagesData as ProductImage[],
	);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [selectedProduct, setSelectedProduct] = React.useState<string>("all");
	const [showPrimaryOnly, setShowPrimaryOnly] = React.useState(false);
	const [selectedImages, setSelectedImages] = React.useState<Set<string>>(
		new Set(),
	);
	const [previewImage, setPreviewImage] = React.useState<ProductImage | null>(
		null,
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [imagesToDelete, setImagesToDelete] = React.useState<string[]>([]);
	const [currentPage, setCurrentPage] = React.useState(1);
	const imagesPerPage = 12;

	// Get unique products for filter
	const uniqueProducts = React.useMemo(() => {
		const productMap = new Map<string, string>();
		images.forEach((img) => {
			productMap.set(img.productId, img.productName);
		});
		return Array.from(productMap.entries()).map(([id, name]) => ({
			id,
			name,
		}));
	}, [images]);

	// Filter images
	const filteredImages = React.useMemo(() => {
		return images.filter((img) => {
			const matchesSearch =
				searchQuery === "" ||
				img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				img.productName.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesProduct =
				selectedProduct === "all" || img.productId === selectedProduct;
			const matchesPrimary = !showPrimaryOnly || img.isPrimary;
			return matchesSearch && matchesProduct && matchesPrimary;
		});
	}, [images, searchQuery, selectedProduct, showPrimaryOnly]);

	// Pagination
	const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
	const paginatedImages = filteredImages.slice(
		(currentPage - 1) * imagesPerPage,
		currentPage * imagesPerPage,
	);

	const toggleImageSelection = (imageId: string) => {
		setSelectedImages((prev) => {
			const next = new Set(prev);
			if (next.has(imageId)) {
				next.delete(imageId);
			} else {
				next.add(imageId);
			}
			return next;
		});
	};

	const selectAllVisible = () => {
		const visibleIds = paginatedImages.map((img) => img.id);
		setSelectedImages((prev) => {
			const next = new Set(prev);
			const allSelected = visibleIds.every((id) => next.has(id));
			if (allSelected) {
				for (const id of visibleIds) {
					next.delete(id);
				}
			} else {
				for (const id of visibleIds) {
					next.add(id);
				}
			}
			return next;
		});
	};

	const handleDeleteImages = (imageIds: string[]) => {
		setImagesToDelete(imageIds);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		setImages((prev) => prev.filter((img) => !imagesToDelete.includes(img.id)));
		setSelectedImages((prev) => {
			const next = new Set(prev);
			for (const id of imagesToDelete) {
				next.delete(id);
			}
			return next;
		});
		setDeleteDialogOpen(false);
		setImagesToDelete([]);
		if (previewImage && imagesToDelete.includes(previewImage.id)) {
			setPreviewImage(null);
		}
	};

	return (
		<div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold text-foreground">Imagens</h1>
				<p className="text-sm text-muted-foreground">
					Visualize todas as imagens de produtos da sua loja
				</p>
			</div>

			{/* Stats */}
			<ImageStats images={images} />

			{/* Filters & Search */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-1 items-center gap-2">
					<div className="relative flex-1 max-w-sm">
						<IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Buscar imagens..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>

					<Select value={selectedProduct} onValueChange={setSelectedProduct}>
						<SelectTrigger className="w-48" aria-label="Filtrar por produto">
							<SelectValue placeholder="Todos os produtos" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos os produtos</SelectItem>
							{uniqueProducts.map((product) => (
								<SelectItem key={product.id} value={product.id}>
									{product.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon">
								<IconFilter className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Filtros</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem
								checked={showPrimaryOnly}
								onCheckedChange={setShowPrimaryOnly}
							>
								Apenas principais
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{selectedImages.size > 0 && (
					<div className="flex items-center gap-2">
						<Badge variant="secondary">
							{selectedImages.size} selecionada(s)
						</Badge>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => handleDeleteImages(Array.from(selectedImages))}
						>
							<IconTrash className="mr-1.5 size-4" />
							Excluir
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setSelectedImages(new Set())}
						>
							<IconX className="mr-1.5 size-4" />
							Limpar
						</Button>
					</div>
				)}
			</div>

			{/* Select All */}
			{paginatedImages.length > 0 && (
				<div className="flex items-center gap-2">
					<Checkbox
						checked={
							paginatedImages.length > 0 &&
							paginatedImages.every((img) => selectedImages.has(img.id))
						}
						onCheckedChange={selectAllVisible}
					/>
					<Label className="text-sm text-muted-foreground">
						Selecionar todos visíveis
					</Label>
				</div>
			)}

			{/* Image Grid */}
			{paginatedImages.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<IconCamera className="size-16 text-muted-foreground/30 mb-4" />
					<h3 className="text-lg font-medium text-foreground">
						Nenhuma imagem encontrada
					</h3>
					<p className="text-sm text-muted-foreground max-w-sm mt-1">
						{searchQuery || selectedProduct !== "all" || showPrimaryOnly
							? "Tente ajustar os filtros de busca"
							: "Adicione imagens aos produtos para visualizá-las aqui"}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
					{paginatedImages.map((image) => (
						<ImageCard
							key={image.id}
							image={image}
							isSelected={selectedImages.has(image.id)}
							onSelect={() => toggleImageSelection(image.id)}
							onPreview={() => setPreviewImage(image)}
							onDelete={() => handleDeleteImages([image.id])}
						/>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Mostrando {(currentPage - 1) * imagesPerPage + 1} a{" "}
						{Math.min(currentPage * imagesPerPage, filteredImages.length)} de{" "}
						{filteredImages.length} imagens
					</p>
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
						>
							<IconChevronLeft className="size-4" />
							Anterior
						</Button>
						<div className="flex items-center gap-1 px-2">
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								let page: number;
								if (totalPages <= 5) {
									page = i + 1;
								} else if (currentPage <= 3) {
									page = i + 1;
								} else if (currentPage >= totalPages - 2) {
									page = totalPages - 4 + i;
								} else {
									page = currentPage - 2 + i;
								}
								return (
									<Button
										key={page}
										variant={currentPage === page ? "default" : "outline"}
										size="sm"
										className="size-8 p-0"
										onClick={() => setCurrentPage(page)}
									>
										{page}
									</Button>
								);
							})}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
						>
							Próximo
							<IconChevronRight className="size-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Preview Dialog */}
			<ImagePreviewDialog
				image={previewImage}
				open={!!previewImage}
				onOpenChange={(open) => !open && setPreviewImage(null)}
				onDelete={() => {
					if (previewImage) {
						handleDeleteImages([previewImage.id]);
					}
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={confirmDelete}
				count={imagesToDelete.length}
			/>
		</div>
	);
}
