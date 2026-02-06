"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	type CreateStoreFormData,
	createStoreSchema,
} from "@/features/stores/schemas/create-store";
import { convertToSlug } from "@/helpers/convert";
import { useCreateStore } from "@/hooks/use-create-store";

interface StoreCreateModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: (slug: string) => void;
}

export function StoreCreateModal({
	open,
	onOpenChange,
	onSuccess,
}: StoreCreateModalProps) {
	const nameId = useId();
	const { mutate, isPending } = useCreateStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateStoreFormData>({
		resolver: zodResolver(createStoreSchema),
	});

	function onSubmit(data: CreateStoreFormData) {
		mutate(
			{ name: data.name, slug: convertToSlug(data.name) },
			{
				onSuccess: (response) => {
					reset();
					onOpenChange(false);
					if (onSuccess) {
						onSuccess(response.slug);
					}
				},
			},
		);
	}

	function handleClose(open: boolean) {
		if (!open) {
			reset();
		}
		onOpenChange(open);
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Adicionar Nova Loja</DialogTitle>
					<DialogDescription>
						Crie uma nova loja para gerenciar seus produtos e pedidos.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={nameId}>Nome da Loja</FieldLabel>
							<Input
								id={nameId}
								placeholder="Digite o nome da loja"
								{...register("name")}
								disabled={isPending}
							/>
							<FieldError errors={errors.name ? [errors.name] : []} />
						</Field>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => handleClose(false)}
								disabled={isPending}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Criando..." : "Criar Loja"}
							</Button>
						</DialogFooter>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
}
