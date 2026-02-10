"use client";

import { useId } from "react";
import { useFormContext } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormData } from "@/features/products/schemas/product-form";

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

	const category = watch("category");
	// const tags = watch("tags");

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
					<Label htmlFor={categoryId}>Categoria</Label>
					<Select
						value={category || ""}
						onValueChange={(value) => setValue("category", value)}
					>
						<SelectTrigger id={categoryId} className="w-full">
							<SelectValue placeholder="Selecione uma categoria" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="bags">Bolsas e Mochilas</SelectItem>
							<SelectItem value="electronics">Eletrônicos</SelectItem>
							<SelectItem value="clothing">Roupas</SelectItem>
							<SelectItem value="accessories">Acessórios</SelectItem>
							<SelectItem value="outdoor">Ar Livre e Aventura</SelectItem>
							<SelectItem value="home">Casa e Decoração</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor={tagsId}>Tags</Label>
					<Input
						id={tagsId}
						placeholder="aventura, viagem, mochila"
						{...register("tags")}
					/>
					<p className="text-muted-foreground text-xs">
						Separe as tags com vírgulas para melhor descoberta
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
