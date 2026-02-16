"use client";

import { IconCheck, IconLoader } from "@tabler/icons-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

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
import { generateSlug } from "@/helpers/generate";
import { useUpdateStore } from "../hooks";
import {
	updateStoreSchema,
	type UpdateStoreFormData,
} from "../schemas/store-settings";

interface StoreInfoSectionProps {
	storeName: string;
	storeSlug: string;
}

export function StoreInfoSection({
	storeName,
	storeSlug,
}: StoreInfoSectionProps) {
	const updateStoreMutation = useUpdateStore();
	const [autoSlug, setAutoSlug] = React.useState(true);
	const nameId = React.useId();
	const slugId = React.useId();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty },
	} = useForm<UpdateStoreFormData>({
		resolver: zodResolver(updateStoreSchema),
		defaultValues: {
			name: storeName,
			slug: storeSlug,
		},
	});

	const nameValue = watch("name");

	React.useEffect(() => {
		if (autoSlug && nameValue) {
			setValue("slug", generateSlug(nameValue), { shouldDirty: true });
		}
	}, [nameValue, autoSlug, setValue]);

	const onSubmit = (data: UpdateStoreFormData) => {
		updateStoreMutation.mutate(
			{ name: data.name, slug: data.slug },
			{
				onSuccess: () => {
					toast.success("Dados da loja atualizados com sucesso!");
					if (data.slug !== storeSlug) {
						window.location.href = `/${data.slug}/settings/general`;
					}
				},
				onError: () => {
					toast.error("Erro ao atualizar dados da loja.");
				},
			},
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Informações da Loja</CardTitle>
				<CardDescription>
					Atualize o nome e o slug da sua loja. O slug é utilizado na URL da
					sua loja.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="grid gap-2">
							<Label htmlFor={nameId}>Nome da loja</Label>
							<Input
								id={nameId}
								placeholder="Minha Loja"
								{...register("name")}
							/>
							{errors.name && (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor={slugId}>Slug</Label>
								<button
									type="button"
									onClick={() => setAutoSlug(!autoSlug)}
									className="text-xs text-muted-foreground hover:text-foreground transition-colors"
								>
									{autoSlug ? "Editar manualmente" : "Gerar automaticamente"}
								</button>
							</div>
							<Input
								id={slugId}
								placeholder="minha-loja"
								disabled={autoSlug}
								{...register("slug")}
							/>
							{errors.slug && (
								<p className="text-sm text-destructive">
									{errors.slug.message}
								</p>
							)}
							<p className="text-xs text-muted-foreground">
								URL: https://oatomicstore.com/
								<span className="font-medium">{watch("slug") || "..."}</span>
							</p>
						</div>
					</div>

					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={updateStoreMutation.isPending || !isDirty}
						>
							{updateStoreMutation.isSuccess ? (
								<>
									<IconCheck className="mr-1.5 size-4" />
									Salvo!
								</>
							) : updateStoreMutation.isPending ? (
								<>
									<IconLoader className="mr-1.5 size-4 animate-spin" />
									Salvando...
								</>
							) : (
								"Salvar Alterações"
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
