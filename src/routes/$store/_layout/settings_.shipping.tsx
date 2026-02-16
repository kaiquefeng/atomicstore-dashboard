"use client";

import {
	IconCheck,
	IconExternalLink,
	IconInfoCircle,
	IconLoader,
	IconPackage,
	IconPlus,
	IconTrash,
	IconTruck,
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Switch } from "@/components/ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	useCreateShippingMethod,
	useShippingMethods,
	useShippingSettings,
	useUpdateShippingMethod,
	useUpdateShippingSettings,
} from "@/features/shipping/hooks";
import type { ShippingMethod } from "@/features/shipping/types";

export const Route = createFileRoute("/$store/_layout/settings_/shipping")({
	component: ShippingSettingsPage,
});

const CARRIER_OPTIONS = [
	{ value: "correios", label: "Correios", logo: "📦" },
	{ value: "melhor_envio", label: "Melhor Envio", logo: "🚚" },
	{ value: "jadlog", label: "JadLog", logo: "📮" },
	{ value: "loggi", label: "Loggi", logo: "🛵" },
	{ value: "custom", label: "Personalizado", logo: "⚙️" },
];

const CORREIOS_METHODS = [
	{ name: "SEDEX", code: "04014", estimatedDays: "1-3" },
	{ name: "SEDEX 10", code: "04790", estimatedDays: "1" },
	{ name: "SEDEX 12", code: "04782", estimatedDays: "1" },
	{ name: "SEDEX Hoje", code: "04804", estimatedDays: "0" },
	{ name: "PAC", code: "04510", estimatedDays: "5-10" },
	{ name: "PAC Mini", code: "04227", estimatedDays: "5-12" },
];

const REGIONS = [
	{ value: "all", label: "Todo o Brasil" },
	{ value: "sul", label: "Sul" },
	{ value: "sudeste", label: "Sudeste" },
	{ value: "centro_oeste", label: "Centro-Oeste" },
	{ value: "nordeste", label: "Nordeste" },
	{ value: "norte", label: "Norte" },
];

interface FreeShippingRule {
	id: string;
	minOrderValue: string;
	enabled: boolean;
	regions: string[];
}

function ShippingSettingsPage() {
	const { shippingMethods, isLoading: isLoadingMethods } = useShippingMethods();
	const { shippingSettings, isLoading: isLoadingSettings } =
		useShippingSettings();
	const updateSettingsMutation = useUpdateShippingSettings();
	const updateMethodMutation = useUpdateShippingMethod();
	const createMethodMutation = useCreateShippingMethod();
	// const deleteMethodMutation = useDeleteShippingMethod();

	const [carrier, setCarrier] = React.useState("correios");
	const [apiKey, setApiKey] = React.useState("");
	const [contractCode, setContractCode] = React.useState("");
	const [postingCard, setPostingCard] = React.useState("");
	const [originCep, setOriginCep] = React.useState("");

	const [localMethods, setLocalMethods] = React.useState<
		Array<ShippingMethod & { isNew?: boolean }>
	>([]);

	const [freeShippingRules, setFreeShippingRules] = React.useState<
		FreeShippingRule[]
	>([
		{
			id: "1",
			minOrderValue: "150",
			enabled: true,
			regions: ["all"],
		},
	]);

	const [enableFreeShipping, setEnableFreeShipping] = React.useState(true);

	React.useEffect(() => {
		if (shippingSettings) {
			setCarrier(shippingSettings.carrier || "correios");
			setApiKey(shippingSettings.apiKey || "");
			setContractCode(shippingSettings.contractCode || "");
			setPostingCard(shippingSettings.postingCard || "");
			setOriginCep(shippingSettings.originCep || "");
			setEnableFreeShipping(shippingSettings.enableFreeShipping ?? true);
			if (shippingSettings.freeShippingMinValue) {
				setFreeShippingRules([
					{
						id: "1",
						minOrderValue: String(shippingSettings.freeShippingMinValue),
						enabled: true,
						regions: shippingSettings.freeShippingRegions || ["all"],
					},
				]);
			}
		}
	}, [shippingSettings]);

	React.useEffect(() => {
		if (shippingMethods.length > 0) {
			setLocalMethods(shippingMethods);
		} else if (!isLoadingMethods) {
			setLocalMethods(
				CORREIOS_METHODS.map((m, i) => ({
					id: `local-${i}`,
					...m,
					carrier: "correios",
					enabled: m.code === "04014" || m.code === "04510",
					additionalFee: 0,
					isNew: true,
				})),
			);
		}
	}, [shippingMethods, isLoadingMethods]);

	const toggleShippingMethod = (methodId: string) => {
		const method = localMethods.find((m) => m.id === methodId);
		if (!method) return;

		setLocalMethods((prev) =>
			prev.map((m) => (m.id === methodId ? { ...m, enabled: !m.enabled } : m)),
		);
	};

	const updateMethodFee = (methodId: string, fee: string) => {
		setLocalMethods((prev) =>
			prev.map((m) =>
				m.id === methodId ? { ...m, additionalFee: parseFloat(fee) || 0 } : m,
			),
		);
	};

	const addFreeShippingRule = () => {
		setFreeShippingRules((prev) => [
			...prev,
			{
				id: `rule-${Date.now()}`,
				minOrderValue: "100",
				enabled: true,
				regions: ["all"],
			},
		]);
	};

	const removeFreeShippingRule = (ruleId: string) => {
		setFreeShippingRules((prev) => prev.filter((r) => r.id !== ruleId));
	};

	const updateFreeShippingRule = (
		ruleId: string,
		updates: Partial<FreeShippingRule>,
	) => {
		setFreeShippingRules((prev) =>
			prev.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
		);
	};

	const handleSave = async () => {
		updateSettingsMutation.mutate({
			carrier,
			apiKey: apiKey || undefined,
			contractCode: contractCode || undefined,
			postingCard: postingCard || undefined,
			originCep,
			enableFreeShipping,
			freeShippingMinValue: freeShippingRules[0]
				? parseFloat(freeShippingRules[0].minOrderValue)
				: undefined,
			freeShippingRegions: freeShippingRules[0]?.regions,
		});

		for (const method of localMethods) {
			if (method.isNew) {
				createMethodMutation.mutate({
					name: method.name,
					code: method.code,
					carrier: method.carrier,
					enabled: method.enabled,
					estimatedDays: method.estimatedDays,
					additionalFee: method.additionalFee,
				});
			} else {
				updateMethodMutation.mutate({
					id: method.id,
					name: method.name,
					code: method.code,
					carrier: method.carrier,
					enabled: method.enabled,
					estimatedDays: method.estimatedDays,
					additionalFee: method.additionalFee,
				});
			}
		}
	};

	const isSaving =
		updateSettingsMutation.isPending ||
		updateMethodMutation.isPending ||
		createMethodMutation.isPending;
	const saved = updateSettingsMutation.isSuccess;

	const enabledMethodsCount = localMethods.filter((m) => m.enabled).length;

	if (isLoadingMethods || isLoadingSettings) {
		return (
			<div className="flex items-center justify-center h-64">
				<IconLoader className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Configurações de Frete
					</h1>
					<p className="text-sm text-muted-foreground">
						Configure as opções de envio para sua loja
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
						"Salvar Configurações"
					)}
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<IconTruck className="size-5" />
						Transportadora
					</CardTitle>
					<CardDescription>
						Selecione a transportadora e configure as credenciais de API
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-2">
						<Label htmlFor="carrier-select">Transportadora</Label>
						<Select value={carrier} onValueChange={setCarrier}>
							<SelectTrigger className="w-full sm:w-80" id="carrier-select">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CARRIER_OPTIONS.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										<span className="flex items-center gap-2">
											<span>{option.logo}</span>
											{option.label}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Separator />

					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<h3 className="font-medium">Credenciais da API</h3>
							<Tooltip>
								<TooltipTrigger>
									<IconInfoCircle className="size-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent className="max-w-xs">
									Obtenha suas credenciais no portal do{" "}
									{CARRIER_OPTIONS.find((c) => c.value === carrier)?.label}
								</TooltipContent>
							</Tooltip>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="api-key">Chave da API (Token)</Label>
								<Input
									id="api-key"
									type="password"
									placeholder="Sua chave de API"
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
								/>
							</div>

							{carrier === "correios" && (
								<>
									<div className="grid gap-2">
										<Label htmlFor="contract-code">Código do Contrato</Label>
										<Input
											id="contract-code"
											placeholder="Ex: 9912345678"
											value={contractCode}
											onChange={(e) => setContractCode(e.target.value)}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="posting-card">Cartão de Postagem</Label>
										<Input
											id="posting-card"
											placeholder="Ex: 0076543210"
											value={postingCard}
											onChange={(e) => setPostingCard(e.target.value)}
										/>
									</div>
								</>
							)}

							<div className="grid gap-2">
								<Label htmlFor="origin-cep">CEP de Origem</Label>
								<Input
									id="origin-cep"
									placeholder="00000-000"
									value={originCep}
									onChange={(e) => setOriginCep(e.target.value)}
									maxLength={9}
								/>
								<p className="text-xs text-muted-foreground">
									CEP de onde os produtos serão enviados
								</p>
							</div>
						</div>

						<Button variant="outline" size="sm" asChild>
							<a
								href={
									carrier === "correios"
										? "https://cws.correios.com.br"
										: carrier === "melhor_envio"
											? "https://melhorenvio.com.br"
											: "#"
								}
								target="_blank"
								rel="noopener noreferrer"
							>
								<IconExternalLink className="mr-1.5 size-4" />
								Obter credenciais
							</a>
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<IconPackage className="size-5" />
						Métodos de Envio
					</CardTitle>
					<CardDescription>
						Selecione quais métodos de envio estarão disponíveis na sua loja
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex items-center gap-2">
						<Badge variant="secondary">
							{enabledMethodsCount} método(s) ativo(s)
						</Badge>
					</div>

					<div className="space-y-3">
						{localMethods.map((method) => (
							<div
								key={method.id}
								className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
									method.enabled
										? "border-primary/30 bg-primary/5"
										: "border-border bg-muted/30"
								}`}
							>
								<div className="flex items-center gap-4">
									<Checkbox
										checked={method.enabled}
										onCheckedChange={() => toggleShippingMethod(method.id)}
									/>
									<div>
										<div className="flex items-center gap-2">
											<span className="font-medium">{method.name}</span>
											<Badge variant="outline" className="text-xs">
												{method.code}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											Prazo estimado: {method.estimatedDays} dia(s) útil(eis)
										</p>
									</div>
								</div>

								{method.enabled && (
									<div className="flex items-center gap-2">
										<Label
											htmlFor={`fee-${method.id}`}
											className="text-sm text-muted-foreground"
										>
											Taxa adicional:
										</Label>
										<div className="flex items-center gap-1">
											<span className="text-sm text-muted-foreground">R$</span>
											<Input
												id={`fee-${method.id}`}
												type="number"
												className="w-20 h-8"
												value={method.additionalFee}
												onChange={(e) =>
													updateMethodFee(method.id, e.target.value)
												}
												min="0"
												step="0.01"
											/>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								🎁 Frete Grátis
							</CardTitle>
							<CardDescription>
								Configure regras para oferecer frete grátis aos clientes
							</CardDescription>
						</div>
						<Switch
							checked={enableFreeShipping}
							onCheckedChange={setEnableFreeShipping}
						/>
					</div>
				</CardHeader>
				{enableFreeShipping && (
					<CardContent className="space-y-4">
						{freeShippingRules.map((rule) => (
							<div
								key={rule.id}
								className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
							>
								<div className="grid gap-2 flex-1">
									<Label htmlFor={`min-value-${rule.id}`}>
										Valor mínimo do pedido
									</Label>
									<div className="flex items-center gap-1">
										<span className="text-sm text-muted-foreground">R$</span>
										<Input
											id={`min-value-${rule.id}`}
											type="number"
											className="w-32"
											value={rule.minOrderValue}
											onChange={(e) =>
												updateFreeShippingRule(rule.id, {
													minOrderValue: e.target.value,
												})
											}
											min="0"
											step="0.01"
										/>
									</div>
								</div>

								<div className="grid gap-2 flex-1">
									<Label htmlFor={`region-${rule.id}`}>Região</Label>
									<Select
										value={rule.regions[0] || "all"}
										onValueChange={(value) =>
											updateFreeShippingRule(rule.id, {
												regions: [value],
											})
										}
									>
										<SelectTrigger id={`region-${rule.id}`}>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{REGIONS.map((region) => (
												<SelectItem key={region.value} value={region.value}>
													{region.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{freeShippingRules.length > 1 && (
									<Button
										variant="ghost"
										size="icon"
										className="self-end text-destructive hover:text-destructive"
										onClick={() => removeFreeShippingRule(rule.id)}
									>
										<IconTrash className="size-4" />
									</Button>
								)}
							</div>
						))}

						<Button variant="outline" size="sm" onClick={addFreeShippingRule}>
							<IconPlus className="mr-1.5 size-4" />
							Adicionar regra
						</Button>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
