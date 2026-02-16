"use client";

import { IconCamera, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import type {
	ProductImage,
	ProductVariant,
} from "@/features/products/schemas/product-form";

interface VariantImagePickerDrawerProps {
	imagePickerVariantId: string | null;
	onClose: () => void;
	images: ProductImage[];
	variants: ProductVariant[];
	onUpdateVariant: (id: string, updates: Partial<ProductVariant>) => void;
}

export function VariantImagePickerDrawer({
	imagePickerVariantId,
	onClose,
	images,
	variants,
	onUpdateVariant,
}: VariantImagePickerDrawerProps) {
	return (
		<Drawer
			open={!!imagePickerVariantId}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Selecionar Imagem</DrawerTitle>
					<DrawerDescription>
						{imagePickerVariantId &&
							(() => {
								const variant = variants.find(
									(v) => v.id === imagePickerVariantId,
								);
								return variant
									? `Escolha uma imagem para: ${variant.title || "Variação"}`
									: "Escolha uma imagem para esta variação";
							})()}
					</DrawerDescription>
				</DrawerHeader>

				<div className="px-4 pb-4">
					{images.length === 0 ? (
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
							{images.map((img, imgIndex) => {
								const currentVariant = variants.find(
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
												onUpdateVariant(imagePickerVariantId, {
													imageId: img.id,
												});
												onClose();
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
	);
}
