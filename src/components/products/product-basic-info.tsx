"use client";

import { IconChevronDown } from "@tabler/icons-react";
import * as React from "react";
import { useId } from "react";
import { useFormContext } from "react-hook-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/categories/hooks/use-categories";
import type { Category } from "@/features/categories/types";
import type { ProductFormData } from "@/features/products/schemas/product-form";
import { useTags } from "@/features/tags/hooks/use-tags";
import { cn } from "@/lib/utils";

function flattenCategoryTree(
	categories: Category[],
	prefix = "",
): { id: string; label: string }[] {
	const result: { id: string; label: string }[] = [];
	for (const cat of categories) {
		const label = prefix ? `${prefix} > ${cat.name}` : cat.name;
		result.push({ id: cat.id, label });
		if (cat.children.length > 0) {
			result.push(
				...flattenCategoryTree(
					cat.children,
					prefix ? `${prefix} > ${cat.name}` : cat.name,
				),
			);
		}
	}
	return result;
}

export function ProductBasicInfo() {
	const {
		register,
		watch,
		setValue,
		formState: { errors },
	} = useFormContext<ProductFormData>();

	const titleId = useId();
	const descriptionId = useId();
	const categoryId = useId();
	const tagsId = useId();

	const categoryIds = watch("categoryIds") ?? [];
	const tagIds = watch("tagIds") ?? [];

	const { categories = [], isLoading: isLoadingCategories } = useCategories();
	const { tags = [], isLoading: isLoadingTags } = useTags();

	const flatCategories = React.useMemo(
		() => flattenCategoryTree(categories),
		[categories],
	);

	function toggleCategoryId(id: string) {
		const next = categoryIds.includes(id)
			? categoryIds.filter((c) => c !== id)
			: [...categoryIds, id];
		setValue("categoryIds", next, { shouldDirty: true });
	}

	function toggleTagId(tagId: string) {
		const next = tagIds.includes(tagId)
			? tagIds.filter((id) => id !== tagId)
			: [...tagIds, tagId];
		setValue("tagIds", next, { shouldDirty: true });
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
						1
					</span>
					Informações Básicas
				</CardTitle>
				<CardDescription>
					Comece com os detalhes essenciais do seu produto
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor={titleId}>Título do Produto</Label>
					<Input
						id={titleId}
						placeholder="Ex: Mochila Premium"
						{...register("title")}
						className="text-lg font-medium"
					/>
					{errors.title && (
						<p className="text-destructive text-xs">{errors.title.message}</p>
					)}
					<p className="text-muted-foreground text-xs">
						Escolha um título que descreva claramente seu produto
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor={descriptionId}>Descrição</Label>
					<Textarea
						id={descriptionId}
						placeholder="Descreva seu produto em detalhes..."
						{...register("description")}
						className="min-h-[160px] resize-y"
					/>
					<p className="text-muted-foreground text-xs">
						Inclua características principais, materiais, dimensões e casos de
						uso
					</p>
				</div>

				<Separator />

				<div className="space-y-2">
					<Label htmlFor={categoryId}>Categorias</Label>
					<Popover>
						<PopoverTrigger asChild>
							<button
								type="button"
								id={categoryId}
								className={cn(
									"flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
								)}
								disabled={isLoadingCategories}
							>
								<span className="truncate text-left">
									{isLoadingCategories
										? "Carregando categorias..."
										: categoryIds.length > 0
											? `${categoryIds.length} categoria(s) selecionada(s)`
											: "Selecione as categorias"}
								</span>
								<IconChevronDown className="size-4 shrink-0 opacity-50" />
							</button>
						</PopoverTrigger>
						<PopoverContent
							className="w-[var(--radix-popover-trigger-width)] p-2"
							align="start"
						>
							<div className="max-h-60 space-y-2 overflow-y-auto">
								{flatCategories.length === 0 && !isLoadingCategories ? (
									<p className="text-muted-foreground py-2 text-sm">
										Nenhuma categoria cadastrada. Crie categorias no menu
										Categorias.
									</p>
								) : (
									flatCategories.map((item) => (
										<label
											key={item.id}
											htmlFor={`${categoryId}-cat-${item.id}`}
											className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-muted/50"
										>
											<Checkbox
												id={`${categoryId}-cat-${item.id}`}
												checked={categoryIds.includes(item.id)}
												onCheckedChange={() => toggleCategoryId(item.id)}
											/>
											<span className="text-sm">{item.label}</span>
										</label>
									))
								)}
							</div>
						</PopoverContent>
					</Popover>
					<p className="text-muted-foreground text-xs">
						Selecione uma ou mais categorias para organizar o produto
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor={tagsId}>Tags</Label>
					<Popover>
						<PopoverTrigger asChild>
							<button
								type="button"
								id={tagsId}
								className={cn(
									"flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
								)}
								disabled={isLoadingTags}
							>
								<span className="truncate text-left">
									{isLoadingTags
										? "Carregando tags..."
										: tagIds.length > 0
											? `${tagIds.length} tag(s) selecionada(s)`
											: "Selecione as tags"}
								</span>
								<IconChevronDown className="size-4 shrink-0 opacity-50" />
							</button>
						</PopoverTrigger>
						<PopoverContent
							className="w-[var(--radix-popover-trigger-width)] p-2"
							align="start"
						>
							<div className="max-h-60 overflow-y-auto space-y-2">
								{tags.length === 0 && !isLoadingTags ? (
									<p className="text-muted-foreground text-sm py-2">
										Nenhuma tag cadastrada. Crie tags em Tags no menu.
									</p>
								) : (
									tags.map((tag) => (
										<label
											key={tag.id}
											htmlFor={`${tagsId}-tag-${tag.id}`}
											className="flex items-center gap-2 cursor-pointer rounded-sm py-1.5 px-2 hover:bg-muted/50"
										>
											<Checkbox
												id={`${tagsId}-tag-${tag.id}`}
												checked={tagIds.includes(tag.id)}
												onCheckedChange={() => toggleTagId(tag.id)}
											/>
											<span className="text-sm">{tag.name}</span>
										</label>
									))
								)}
							</div>
						</PopoverContent>
					</Popover>
					<p className="text-muted-foreground text-xs">
						Selecione as tags para facilitar a descoberta do produto
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
