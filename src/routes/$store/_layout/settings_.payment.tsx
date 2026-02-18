"use client";

import { IconCreditCard, IconLoader, IconCheck } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";

export const Route = createFileRoute("/$store/_layout/settings_/payment")({
	component: StorePaymentSettingsPage,
});

// Mock: métodos disponíveis (virão da API depois)
const MOCK_PAYMENT_METHODS = [
	{ id: "stripe", name: "Stripe", description: "Cartão de crédito e mais" },
	{ id: "pix", name: "PIX", description: "Pagamento instantâneo" },
	{ id: "boleto", name: "Boleto bancário", description: "Pagamento em até 3 dias" },
];

function StorePaymentSettingsPage() {
	const storeSlug = useStoreSlug();
	const { stores, isLoading } = useStores();
	const [selectedMethodId, setSelectedMethodId] = React.useState<string>("");
	const [isSaving, setIsSaving] = React.useState(false);
	const [saved, setSaved] = React.useState(false);

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	function handleSave() {
		setIsSaving(true);
		setTimeout(() => {
			setIsSaving(false);
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		}, 600);
	}

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<IconLoader className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!currentStore) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-muted-foreground">Loja não encontrada.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Cobrança
					</h1>
					<p className="text-sm text-muted-foreground">
						Escolha o método de pagamento para sua loja
					</p>
				</div>
				<Button onClick={handleSave} disabled={isSaving}>
					{saved ? (
						<>
							<IconCheck className="mr-1.5 size-4" />
							Salvo!
						</>
					) : isSaving ? (
						"Salvando..."
					) : (
						"Salvar"
					)}
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<IconCreditCard className="size-5" />
						Método de pagamento
					</CardTitle>
					<CardDescription>
						Selecione um método de pagamento para que sua loja possa receber
						pedidos. Apenas métodos cadastrados pela administração aparecem
						aqui.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-3">
						{MOCK_PAYMENT_METHODS.map((method) => (
							<button
								type="button"
								key={method.id}
								onClick={() => setSelectedMethodId(method.id)}
								className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
									selectedMethodId === method.id
										? "border-primary bg-primary/5"
										: "border-border hover:bg-muted/50"
								}`}
							>
								<div
									className={`mt-0.5 size-4 shrink-0 rounded-full border-2 ${
										selectedMethodId === method.id
											? "border-primary bg-primary"
											: "border-muted-foreground"
									}`}
								/>
								<div className="flex flex-1 flex-col gap-0.5">
									<span className="font-medium">{method.name}</span>
									<span className="text-sm text-muted-foreground">
										{method.description}
									</span>
								</div>
							</button>
						))}
					</div>
					{MOCK_PAYMENT_METHODS.length === 0 && (
						<p className="text-sm text-muted-foreground">
							Nenhum método de pagamento disponível. Peça ao administrador para
							cadastrar métodos.
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
