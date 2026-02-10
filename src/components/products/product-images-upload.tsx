"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UseProductsImagesReturn } from "@/features/products/hooks/use-products-images";

interface ProductImagesUploadProps {
	images: UseProductsImagesReturn["images"];
	onAddImages: (files: File[]) => void;
	onRemoveImage: (id: string) => void;
}

export function ProductImagesUpload({
	images,
	onAddImages,
	onRemoveImage,
}: ProductImagesUploadProps) {
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
		onAddImages(files);
	}

	function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			onAddImages(Array.from(e.target.files));
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
						2
					</span>
					Imagens do Produto
				</CardTitle>
				<CardDescription>
					Adicione imagens padrão do produto que podem ser usadas nas variações
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
						{images.map((image, index) => (
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
												onClick={() => onRemoveImage(image.id)}
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
					Arraste para reordenar. A primeira imagem será a imagem principal do
					produto. Suporta PNG, JPG, WebP até 10MB.
				</p>
			</CardContent>
		</Card>
	);
}
