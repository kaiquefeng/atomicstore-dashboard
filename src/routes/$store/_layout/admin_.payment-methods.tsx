"use client";

import {
	IconCreditCard,
	IconEdit,
	IconLoader,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminPaymentMethods } from "@/features/payment-methods/use-admin-payment-methods";

export const Route = createFileRoute("/$store/_layout/admin_/payment-methods")({
	component: AdminPaymentMethodsPage,
});

function AdminPaymentMethodsPage() {
	const {
		methods,
		isLoading,
		isCreating,
		isUpdating,
		isDeleting,
		dialogOpen,
		setDialogOpen,
		editingMethodId,
		formName,
		setFormName,
		formSlug,
		setFormSlug,
		formConfigPairs,
		handleConfigPairChange,
		handleAddConfigPairRow,
		handleRemoveConfigPairRow,
		openCreateDialog,
		openEditDialog,
		handleSubmitMethod,
		handleRemoveMethod,
	} = useAdminPaymentMethods();
	const isSubmitting = isCreating || isUpdating;
	const idName = React.useId();
	const idSlug = React.useId();
	const idConfig = React.useId();

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<IconLoader className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Métodos de pagamento (Admin)
					</h1>
					<p className="text-sm text-muted-foreground">
						Cadastre os métodos de pagamento disponíveis para as lojas
					</p>
				</div>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={openCreateDialog}>
							<IconPlus className="mr-1.5 size-4" />
							Novo método
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{editingMethodId
									? "Editar método de pagamento"
									: "Cadastrar método de pagamento"}
							</DialogTitle>
							<DialogDescription>
								Os métodos cadastrados aqui poderão ser escolhidos pelos donos
								de loja em Configurações → Cobrança.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor={idName}>Nome</Label>
								<Input
									id={idName}
									placeholder="Ex: Stripe, PIX"
									value={formName}
									onChange={(e) => setFormName(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor={idSlug}>Slug (identificador)</Label>
								<Input
									id={idSlug}
									placeholder="Ex: stripe, pix"
									value={formSlug}
									onChange={(e) => setFormSlug(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor={idConfig}>Configuração (chave / valor)</Label>
								<div className="space-y-2">
									{formConfigPairs.map((pair, index) => (
										<div
											key={pair.id}
											className="flex gap-2"
										>
											<Input
												id={index === 0 ? idConfig : undefined}
												placeholder="Ex: public_key"
												value={pair.key}
												onChange={(e) =>
													handleConfigPairChange(index, "key", e.target.value)
												}
											/>
											<Input
												placeholder="Ex: pk_test_123"
												disabled
												value={pair.value}
												onChange={(e) =>
													handleConfigPairChange(index, "value", e.target.value)
												}
											/>
											<Button
												type="button"
												variant="outline"
												size="icon"
												className="shrink-0"
												onClick={() => handleRemoveConfigPairRow(index)}
											>
												<IconTrash className="size-4" />
											</Button>
										</div>
									))}
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="mt-1 flex items-center gap-1 px-0 text-muted-foreground hover:text-foreground"
										onClick={handleAddConfigPairRow}
									>
										<IconPlus className="size-4" />
										<span>Adicionar chave / valor</span>
									</Button>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDialogOpen(false)}>
								Cancelar
							</Button>
							<Button
								onClick={handleSubmitMethod}
								disabled={!formName.trim() || isSubmitting}
							>
								{isSubmitting ? (
									<>
										<IconLoader className="mr-1.5 size-4 animate-spin" />
										{editingMethodId ? "Salvando..." : "Cadastrando..."}
									</>
								) : editingMethodId ? (
									"Salvar alterações"
								) : (
									"Cadastrar"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<IconCreditCard className="size-5" />
						Métodos cadastrados
					</CardTitle>
					<CardDescription>
						Lista de métodos que os owners podem selecionar para suas lojas
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{methods.map((method) => (
							<div
								key={method.id}
								className="flex items-center justify-between rounded-lg border p-4"
							>
								<div>
									<div className="flex items-center gap-2">
										<span className="font-medium">{method.name}</span>
										<span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
											{method.slug}
										</span>
									</div>
									<div className="flex flex-wrap gap-1 mt-3">
										{Object.entries(method.metadata ?? {}).map(([key]) => (
											<Badge variant="outline" key={key}>
												{key}
											</Badge>
										))}
									</div>
								</div>
								<div className="flex shrink-0 gap-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => openEditDialog(method)}
										title="Editar"
									>
										<IconEdit className="size-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="text-destructive hover:text-destructive"
										onClick={() => handleRemoveMethod(method.id)}
										disabled={isDeleting}
										title="Excluir"
									>
										<IconTrash className="size-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
					{methods.length === 0 && (
						<p className="py-8 text-center text-sm text-muted-foreground">
							Nenhum método cadastrado. Clique em &quot;Novo método&quot; para
							adicionar.
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
