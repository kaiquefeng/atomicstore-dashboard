"use client";

import {
	IconCamera,
	IconEdit,
	IconPlus,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import * as React from "react";
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
import type {
	ProductImage,
	ProductVariant,
	VariantOption,
} from "@/features/products/schemas/product-form";

interface ProductVariantsSectionProps {
	variants: ProductVariant[];
	variantOptions: VariantOption[];
	onAddVariant: () => void;
	onUpdateVariant: (id: string, updates: Partial<ProductVariant>) => void;
	onSetVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
	onAddVariantOption: () => void;
	onRemoveVariantOption: (id: string) => void;
	onUpdateVariantOption: (id: string, updates: Partial<VariantOption>) => void;
	onAddValueToVariant: (optionId: string, value: string) => void;
	onRemoveValueFromVariant: (optionId: string, index: number) => void;
	onGenerateVariantsFromOptions: () => void;
	onOpenImagePicker: (variantId: string) => void;
	onOpenEditDrawer: (variantId: string) => void;
	images: ProductImage[];
}

export function ProductVariantsSection({
	variants,
	variantOptions,
	onAddVariant,
	onUpdateVariant,
	onSetVariants,
	onAddVariantOption,
	onRemoveVariantOption,
	onUpdateVariantOption,
	onAddValueToVariant,
	onRemoveValueFromVariant,
	onGenerateVariantsFromOptions,
	onOpenImagePicker,
	onOpenEditDrawer,
	images,
}: ProductVariantsSectionProps) {
	return (
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
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Label className="text-base font-semibold">
							Propriedades
						</Label>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onAddVariantOption}
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
												onUpdateVariantOption(option.id, { name: value })
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
											onClick={() => onRemoveVariantOption(option.id)}
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
														onRemoveValueFromVariant(option.id, valueIndex)
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
												onAddValueToVariant(option.id, value)
											}
										/>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{variantOptions.length > 0 &&
					variantOptions.some((o) => o.values.length > 0) && (
						<div className="flex justify-end">
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={onGenerateVariantsFromOptions}
							>
								<IconPlus className="size-4 mr-1" />
								Gerar Variações
							</Button>
						</div>
					)}

				<Separator />

				<div className="space-y-3">
					<Label className="text-base font-semibold">Variação</Label>

					{variants.length === 0 ? (
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
								onClick={onAddVariant}
							>
								<IconPlus className="size-4 mr-1" />
								Adicionar Manualmente
							</Button>
						</div>
					) : (
						<div className="rounded-lg border overflow-hidden">
							<div className="grid grid-cols-[1fr_120px_120px_120px_60px] gap-3 px-4 py-3 bg-muted/50 border-b text-sm font-medium text-muted-foreground">
								<span>Variação</span>
								<span>Estoque</span>
								<span>Preço</span>
								<span>Peso</span>
								<span>Ações</span>
							</div>

							<div className="divide-y">
								{variants.map((variant) => {
									const selectedImage = variant.imageId
										? images.find(
												(img) => img.id === variant.imageId,
											)
										: images[0];

									return (
										<div
											key={variant.id}
											className="grid grid-cols-[1fr_120px_120px_120px_60px] gap-3 px-4 py-3 items-center hover:bg-muted/30 transition-colors"
										>
											<div className="flex items-center gap-3">
												<button
													type="button"
													onClick={() =>
														onOpenImagePicker(variant.id)
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
												<span className="font-medium text-primary">
													{variant.title || "Sem título"}
												</span>
											</div>

											<div className="relative">
												<Input
													type="text"
													placeholder="∞"
													value={variant.stock || ""}
													onChange={(e) =>
														onUpdateVariant(variant.id, {
															stock: e.target.value,
														})
													}
													className="h-9 text-center"
												/>
											</div>

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
														onUpdateVariant(variant.id, {
															priceBrl: e.target.value,
														})
													}
													className="h-9 pl-8"
												/>
											</div>

											<div className="relative">
												<Input
													type="number"
													step="0.1"
													placeholder="0.0"
													value={variant.weightKg || ""}
													onChange={(e) =>
														onUpdateVariant(variant.id, {
															weightKg: e.target.value,
														})
													}
													className="h-9 pr-8"
												/>
												<span className="text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 text-xs">
													kg
												</span>
											</div>

											<div className="flex justify-center">
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															className="size-9 rounded-full border"
															onClick={() => onOpenEditDrawer(variant.id)}
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

				{variants.length > 0 && (
					<div className="flex items-center justify-between pt-2">
						<div className="text-sm text-muted-foreground">
							<span className="font-medium text-foreground">
								{variants.length}
							</span>{" "}
							variação{variants.length > 1 ? "ões" : ""}{" "}
							configurada
							{variants.length > 1 ? "s" : ""}
						</div>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="text-destructive hover:text-destructive"
							onClick={() => onSetVariants([])}
						>
							<IconTrash className="size-4 mr-1" />
							Limpar Todas
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
