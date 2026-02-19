"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconCheck,
	IconLoader,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import * as React from "react";
import type { Resolver } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SOCIAL_LINK_OPTIONS } from "@/constants/social-link-options";
import { generateSlug } from "@/helpers/generate";
import { useUpdateStore } from "../hooks";
import {
	type UpdateStoreFormData,
	updateStoreSchema,
} from "../schemas/store-settings";

function socialLinksArrayToRecord(
	rows: Array<{ network: string; value: string }>,
): Record<string, string> {
	return rows
		.filter((row) => row.network.trim() && row.value.trim())
		.reduce(
			(acc, row) => {
				acc[row.network.trim()] = row.value.trim();
				return acc;
			},
			{} as Record<string, string>,
		);
}

function recordToSocialLinksArray(
	record?: Record<string, string> | null,
): Array<{ network: string; value: string }> {
	if (!record || Object.keys(record).length === 0) {
		return [{ network: "", value: "" }];
	}
	return Object.entries(record).map(([network, value]) => ({
		network,
		value,
	}));
}

interface StoreInfoSectionProps {
	storeName: string;
	storeSlug: string;
	storeDescription?: string;
	storeSocialLinks?: Record<string, string> | null;
}

const defaultFormValues: UpdateStoreFormData = {
	name: "",
	slug: "",
	description: "",
	socialLinks: [{ network: "", value: "" }],
};

export function StoreInfoSection({
	storeName,
	storeSlug,
	storeDescription = "",
	storeSocialLinks,
}: StoreInfoSectionProps) {
	const updateStoreMutation = useUpdateStore();
	const [autoSlug, setAutoSlug] = React.useState(true);
	const nameId = React.useId();
	const slugId = React.useId();
	const descriptionId = React.useId();

	const form = useForm<UpdateStoreFormData>({
		resolver: zodResolver(updateStoreSchema) as Resolver<UpdateStoreFormData>,
		defaultValues: {
			...defaultFormValues,
			name: storeName,
			slug: storeSlug,
			description: storeDescription ?? "",
			socialLinks: recordToSocialLinksArray(storeSocialLinks),
		},
	});

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isDirty },
	} = form;

	const { fields, append, remove, update } = useFieldArray({
		control: form.control,
		name: "socialLinks",
	});

	const nameValue = watch("name");

	React.useEffect(() => {
		reset({
			...defaultFormValues,
			name: storeName,
			slug: storeSlug,
			description: storeDescription ?? "",
			socialLinks: recordToSocialLinksArray(storeSocialLinks),
		});
	}, [storeName, storeSlug, storeDescription, storeSocialLinks, reset]);

	React.useEffect(() => {
		if (autoSlug && nameValue) {
			setValue("slug", generateSlug(nameValue), { shouldDirty: true });
		}
	}, [nameValue, autoSlug, setValue]);

	function addSocialLinkRow() {
		append({ network: "", value: "" });
	}

	const onSubmit = (data: UpdateStoreFormData) => {
		const socialLinksRecord = socialLinksArrayToRecord(data.socialLinks);
		updateStoreMutation.mutate(
			{
				name: data.name,
				slug: data.slug,
				description: data.description || undefined,
				socialLinks:
					Object.keys(socialLinksRecord).length > 0
						? socialLinksRecord
						: undefined,
			},
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
					Atualize o nome e o slug da sua loja. O slug é utilizado na URL da sua
					loja.
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

					<div className="grid gap-2">
						<Label htmlFor={descriptionId}>Descrição da loja</Label>
						<Textarea
							id={descriptionId}
							placeholder="Descreva sua loja para os clientes..."
							rows={4}
							className="resize-none"
							{...register("description")}
						/>
					</div>

					<div className="grid gap-2">
						<Label>Redes sociais</Label>
						<div className="space-y-2">
							{fields.map((field, index) => (
								<div
									key={field.id}
									className="flex flex-col gap-2 sm:flex-row sm:items-center"
								>
									<Select
										value={watch(`socialLinks.${index}.network`) || undefined}
										onValueChange={(value) =>
											update(index, {
												network: value,
												value: watch(`socialLinks.${index}.value`) ?? "",
											})
										}
									>
										<SelectTrigger className="w-full sm:w-[180px]">
											<SelectValue placeholder="Selecione a rede" />
										</SelectTrigger>
										<SelectContent>
											{SOCIAL_LINK_OPTIONS.map((opt) => (
												<SelectItem key={opt.value} value={opt.value}>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Input
										placeholder="URL ou @usuario"
										className="flex-1"
										{...register(`socialLinks.${index}.value`)}
									/>
									<Button
										type="button"
										variant="outline"
										size="icon"
										className="shrink-0"
										onClick={() =>
											fields.length <= 1
												? update(index, { network: "", value: "" })
												: remove(index)
										}
										aria-label="Remover rede social"
									>
										<IconTrash className="size-4" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="mt-1 flex w-fit items-center gap-1 px-0 text-muted-foreground hover:text-foreground"
								onClick={addSocialLinkRow}
							>
								<IconPlus className="size-4" />
								<span>Adicionar link</span>
							</Button>
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
