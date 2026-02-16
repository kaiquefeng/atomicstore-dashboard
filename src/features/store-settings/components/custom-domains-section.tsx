"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconAlertTriangle,
	IconCircleCheck,
	IconClock,
	IconCopy,
	IconGlobe,
	IconLoader,
	IconPlus,
	IconRefresh,
	IconTrash,
} from "@tabler/icons-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import {
	useCreateCustomDomain,
	useCustomDomains,
	useDeleteCustomDomain,
	useVerifyCustomDomain,
} from "../hooks";
import {
	type AddDomainFormData,
	addDomainSchema,
} from "../schemas/store-settings";
import type { CustomDomain, DomainStatus } from "../types";

const STATUS_CONFIG: Record<
	DomainStatus,
	{
		label: string;
		variant: "default" | "secondary" | "destructive" | "outline";
		icon: React.ElementType;
	}
> = {
	active: {
		label: "Ativo",
		variant: "default",
		icon: IconCircleCheck,
	},
	pending: {
		label: "Pendente",
		variant: "secondary",
		icon: IconClock,
	},
	verifying: {
		label: "Verificando",
		variant: "outline",
		icon: IconLoader,
	},
	failed: {
		label: "Falhou",
		variant: "destructive",
		icon: IconAlertTriangle,
	},
	removing: {
		label: "Removendo",
		variant: "secondary",
		icon: IconLoader,
	},
};

function DomainStatusBadge({ status }: { status: DomainStatus }) {
	const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
	const StatusIcon = config.icon;

	return (
		<Badge variant={config.variant} className="gap-1">
			<StatusIcon
				className={`size-3 ${status === "verifying" || status === "removing" ? "animate-spin" : ""}`}
			/>
			{config.label}
		</Badge>
	);
}

function DnsRecordRow({
	type,
	name,
	value,
	isVerified,
}: {
	type: string;
	name: string;
	value: string;
	isVerified: boolean;
}) {
	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copiado para a área de transferência!");
	};

	return (
		<div className="flex items-center gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm">
			<Badge variant="outline" className="shrink-0 font-mono text-xs">
				{type}
			</Badge>
			<div className="flex flex-1 items-center gap-2 min-w-0">
				<span className="font-mono text-xs truncate">{name}</span>
				<span className="text-muted-foreground">&rarr;</span>
				<span className="font-mono text-xs truncate flex-1">{value}</span>
			</div>
			<div className="flex items-center gap-1 shrink-0">
				{isVerified ? (
					<IconCircleCheck className="size-4 text-green-500" />
				) : (
					<IconClock className="size-4 text-yellow-500" />
				)}
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-7"
							onClick={() => handleCopy(value)}
						>
							<IconCopy className="size-3.5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Copiar valor</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}

function DomainCard({
	domain,
	onDelete,
	onVerify,
	isDeleting,
	isVerifying,
}: {
	domain: CustomDomain;
	onDelete: (id: string) => void;
	onVerify: (id: string) => void;
	isDeleting: boolean;
	isVerifying: boolean;
}) {
	const [isExpanded, setIsExpanded] = React.useState(
		domain.status === "pending" || domain.status === "failed",
	);

	return (
		<div className="rounded-lg border">
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-3 min-w-0">
					<IconGlobe className="size-5 text-muted-foreground shrink-0" />
					<div className="min-w-0">
						<p className="font-medium truncate">{domain.host}</p>
						{domain.isPrimary && (
							<span className="text-xs text-muted-foreground">
								Domínio principal
							</span>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<DomainStatusBadge status={domain.status} />

					{(domain.status === "pending" || domain.status === "failed") && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="size-8"
									onClick={() => onVerify(domain.id)}
									disabled={isVerifying}
								>
									{isVerifying ? (
										<IconLoader className="size-4 animate-spin" />
									) : (
										<IconRefresh className="size-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>Verificar DNS</TooltipContent>
						</Tooltip>
					)}

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-8 text-destructive hover:text-destructive"
								onClick={() => onDelete(domain.id)}
								disabled={isDeleting}
							>
								{isDeleting ? (
									<IconLoader className="size-4 animate-spin" />
								) : (
									<IconTrash className="size-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>Remover domínio</TooltipContent>
					</Tooltip>
				</div>
			</div>

			{domain.dnsRecords && domain.dnsRecords.length > 0 && (
				<>
					<div className="px-4 pb-1">
						<button
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							{isExpanded ? "Ocultar registros DNS" : "Mostrar registros DNS"}
						</button>
					</div>

					{isExpanded && (
						<div className="space-y-2 border-t px-4 py-3 bg-muted/10">
							<p className="text-xs font-medium text-muted-foreground mb-2">
								Configure os registros DNS abaixo no seu provedor de domínio:
							</p>
							{domain.dnsRecords.map((record, index) => (
								<DnsRecordRow
									key={`${record.type}-${record.name}-${index}`}
									type={record.type}
									name={record.name}
									value={record.value}
									isVerified={record.isVerified}
								/>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}

export function CustomDomainsSection() {
	const { domains, isLoading } = useCustomDomains();
	const createDomainMutation = useCreateCustomDomain();
	const deleteDomainMutation = useDeleteCustomDomain();
	const verifyDomainMutation = useVerifyCustomDomain();

	const [deletingId, setDeletingId] = React.useState<string | null>(null);
	const [verifyingId, setVerifyingId] = React.useState<string | null>(null);
	const domainInputId = React.useId();
	const primaryCheckboxId = React.useId();

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<AddDomainFormData>({
		resolver: zodResolver(addDomainSchema),
		defaultValues: {
			host: "",
			setAsPrimary: false,
		},
	});

	const onSubmit = (data: AddDomainFormData) => {
		createDomainMutation.mutate(
			{ host: data.host, setAsPrimary: data.setAsPrimary },
			{
				onSuccess: () => {
					toast.success("Domínio adicionado! Configure os registros DNS.");
					reset();
				},
				onError: () => {
					toast.error(
						"Erro ao adicionar domínio. Verifique e tente novamente.",
					);
				},
			},
		);
	};

	const handleDelete = (domainId: string) => {
		setDeletingId(domainId);
		deleteDomainMutation.mutate(domainId, {
			onSuccess: () => {
				toast.success("Domínio removido com sucesso!");
				setDeletingId(null);
			},
			onError: () => {
				toast.error("Erro ao remover domínio.");
				setDeletingId(null);
			},
		});
	};

	const handleVerify = (domainId: string) => {
		setVerifyingId(domainId);
		verifyDomainMutation.mutate(domainId, {
			onSuccess: (result) => {
				if (result.isVerified) {
					toast.success("Domínio verificado com sucesso!");
				} else {
					toast("DNS ainda não propagado. Tente novamente em alguns minutos.", {
						icon: "\u23F3",
					});
				}
				setVerifyingId(null);
			},
			onError: () => {
				toast.error("Erro ao verificar domínio.");
				setVerifyingId(null);
			},
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconGlobe className="size-5" />
					Domínios Personalizados
				</CardTitle>
				<CardDescription>
					Conecte seu próprio domínio à sua loja. Após adicionar, configure os
					registros DNS no seu provedor de domínio.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
						<div className="grid gap-2 flex-1">
							<Label htmlFor={domainInputId}>Adicionar domínio</Label>
							<Input
								id={domainInputId}
								placeholder="minha-loja.com.br"
								maxLength={255}
								{...register("host")}
							/>
							{errors.host && (
								<p className="text-sm text-destructive">
									{errors.host.message}
								</p>
							)}
						</div>
						<Button
							type="submit"
							disabled={createDomainMutation.isPending}
							className="shrink-0"
						>
							{createDomainMutation.isPending ? (
								<>
									<IconLoader className="mr-1.5 size-4 animate-spin" />
									Adicionando...
								</>
							) : (
								<>
									<IconPlus className="mr-1.5 size-4" />
									Adicionar Domínio
								</>
							)}
						</Button>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							id={primaryCheckboxId}
							{...register("setAsPrimary")}
							onCheckedChange={(checked) =>
								setValue("setAsPrimary", checked === true)
							}
						/>
						<Label
							htmlFor={primaryCheckboxId}
							className="text-sm font-normal text-muted-foreground cursor-pointer"
						>
							Definir como domínio principal
						</Label>
					</div>
				</form>

				<Separator />

				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<IconLoader className="size-6 animate-spin text-muted-foreground" />
					</div>
				) : domains.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<IconGlobe className="size-10 text-muted-foreground/50 mb-3" />
						<p className="text-sm font-medium text-muted-foreground">
							Nenhum domínio personalizado configurado
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Adicione um domínio acima para conectar à sua loja.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{domains.map((domain) => (
							<DomainCard
								key={domain.id}
								domain={domain}
								onDelete={handleDelete}
								onVerify={handleVerify}
								isDeleting={deletingId === domain.id}
								isVerifying={verifyingId === domain.id}
							/>
						))}
					</div>
				)}

				<div className="rounded-lg border border-dashed p-4 bg-muted/20">
					<h4 className="text-sm font-medium mb-2">
						Como configurar seu domínio?
					</h4>
					<ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
						<li>Adicione o domínio desejado no campo acima</li>
						<li>
							Copie os registros DNS exibidos e configure-os no seu provedor de
							domínio (GoDaddy, Namecheap, Cloudflare, etc.)
						</li>
						<li>
							Aguarde a propagação DNS (pode levar até 48h, normalmente minutos)
						</li>
						<li>
							Clique em &quot;Verificar DNS&quot; para confirmar a configuração
						</li>
					</ol>
				</div>
			</CardContent>
		</Card>
	);
}
