"use client";

import {
	IconCalendar,
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconCopy,
	IconDotsVertical,
	IconInfinity,
	IconPercentage,
	IconPlus,
	IconTag,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import couponsData from "@/constants/coupons-data.json";

export const Route = createFileRoute("/$store/_layout/coupons")({
	component: CouponsPage,
});

interface Coupon {
	id: string;
	code: string;
	type: "percentage" | "fixed";
	value: number;
	minOrderValue: number;
	currency: string;
	createdAt: string;
	expiresAt: string | null;
	hasNoLimit: boolean;
	usageCount: number;
	usageLimit: number | null;
	isActive: boolean;
}

interface NewCoupon {
	code: string;
	type: "percentage" | "fixed";
	value: string;
	minOrderValue: string;
	currency: string;
	expiresAt: string;
	hasNoLimit: boolean;
	usageLimit: string;
}

const CURRENCIES = [
	{ value: "BRL", label: "R$ (BRL)" },
	{ value: "USD", label: "$ (USD)" },
	{ value: "EUR", label: "€ (EUR)" },
];

function formatDate(dateString: string | null): string {
	if (!dateString) return "—";
	const date = new Date(dateString);
	return date.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

function formatCurrency(value: number, currency: string): string {
	const symbols: Record<string, string> = {
		BRL: "R$",
		USD: "$",
		EUR: "€",
	};
	return `${symbols[currency] || currency} ${value.toFixed(2)}`;
}

function CouponTypeBadge({ type }: { type: Coupon["type"] }) {
	if (type === "percentage") {
		return (
			<Badge
				variant="outline"
				className="bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800"
			>
				<IconPercentage className="mr-1 size-3" />
				Porcentagem
			</Badge>
		);
	}
	return (
		<Badge
			variant="outline"
			className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
		>
			<IconTag className="mr-1 size-3" />
			Valor fixo
		</Badge>
	);
}

function CouponStatusBadge({
	isActive,
	isExpired,
}: {
	isActive: boolean;
	isExpired: boolean;
}) {
	if (isExpired) {
		return (
			<Badge
				variant="outline"
				className="bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
			>
				Expirado
			</Badge>
		);
	}
	if (isActive) {
		return (
			<Badge
				variant="outline"
				className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
			>
				Ativo
			</Badge>
		);
	}
	return (
		<Badge
			variant="outline"
			className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
		>
			Inativo
		</Badge>
	);
}

function UsageProgress({
	current,
	limit,
}: {
	current: number;
	limit: number | null;
}) {
	if (limit === null) {
		return (
			<div className="flex items-center gap-2 text-muted-foreground">
				<IconInfinity className="size-4" />
				<span>{current} usos</span>
			</div>
		);
	}

	const percentage = Math.min((current / limit) * 100, 100);
	const isExhausted = current >= limit;

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center justify-between text-xs">
				<span
					className={isExhausted ? "text-destructive" : "text-muted-foreground"}
				>
					{current} / {limit}
				</span>
			</div>
			<div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
				<div
					className={`h-full transition-all ${isExhausted ? "bg-destructive" : "bg-primary"}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}

function CouponStats({ coupons }: { coupons: Coupon[] }) {
	const activeCoupons = coupons.filter((c) => c.isActive).length;
	const totalUsage = coupons.reduce((acc, c) => acc + c.usageCount, 0);
	const avgDiscount =
		coupons.length > 0
			? coupons.reduce((acc, c) => acc + c.value, 0) / coupons.length
			: 0;

	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Cupons Ativos
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{activeCoupons}</div>
					<p className="text-xs text-muted-foreground">
						de {coupons.length} cupons
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Total de Usos
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalUsage}</div>
					<p className="text-xs text-muted-foreground">em todos os cupons</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Desconto Médio
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{avgDiscount.toFixed(0)}%</div>
					<p className="text-xs text-muted-foreground">
						valor médio de desconto
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

const columns: ColumnDef<Coupon>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "code",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3 h-8 data-[state=open]:bg-accent"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Código
				<IconChevronDown
					className={`ml-1 size-4 transition-transform ${
						column.getIsSorted() === "asc" ? "rotate-180" : ""
					}`}
				/>
			</Button>
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<code className="rounded bg-muted px-2 py-1 font-mono text-sm font-semibold">
					{row.original.code}
				</code>
				<Button
					variant="ghost"
					size="icon"
					className="size-6"
					onClick={() => navigator.clipboard.writeText(row.original.code)}
				>
					<IconCopy className="size-3" />
				</Button>
			</div>
		),
	},
	{
		accessorKey: "type",
		header: "Tipo",
		cell: ({ row }) => <CouponTypeBadge type={row.original.type} />,
	},
	{
		accessorKey: "value",
		header: "Desconto",
		cell: ({ row }) => (
			<span className="font-medium text-foreground">
				{row.original.type === "percentage"
					? `${row.original.value}%`
					: formatCurrency(row.original.value, row.original.currency)}
			</span>
		),
	},
	{
		accessorKey: "minOrderValue",
		header: "Valor Mínimo",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{row.original.minOrderValue > 0
					? formatCurrency(row.original.minOrderValue, row.original.currency)
					: "Sem mínimo"}
			</span>
		),
	},
	{
		accessorKey: "expiresAt",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3 h-8 data-[state=open]:bg-accent"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Validade
				<IconChevronDown
					className={`ml-1 size-4 transition-transform ${
						column.getIsSorted() === "asc" ? "rotate-180" : ""
					}`}
				/>
			</Button>
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-2 text-muted-foreground">
				{row.original.hasNoLimit ? (
					<>
						<IconInfinity className="size-4" />
						<span>Sem limite</span>
					</>
				) : (
					<>
						<IconCalendar className="size-4" />
						<span>{formatDate(row.original.expiresAt)}</span>
					</>
				)}
			</div>
		),
	},
	{
		accessorKey: "usageCount",
		header: "Uso",
		cell: ({ row }) => (
			<UsageProgress
				current={row.original.usageCount}
				limit={row.original.usageLimit}
			/>
		),
	},
	{
		accessorKey: "isActive",
		header: "Status",
		cell: ({ row }) => {
			const isExpired =
				row.original.expiresAt !== null &&
				new Date(row.original.expiresAt) < new Date();
			return (
				<CouponStatusBadge
					isActive={row.original.isActive}
					isExpired={isExpired}
				/>
			);
		},
	},
	{
		id: "actions",
		cell: () => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="size-8 text-muted-foreground data-[state=open]:bg-muted"
					>
						<IconDotsVertical className="size-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem>
						<IconCopy className="mr-2 size-4" />
						Copiar código
					</DropdownMenuItem>
					<DropdownMenuItem>
						<IconTag className="mr-2 size-4" />
						Editar
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive">
						<IconTrash className="mr-2 size-4" />
						Excluir
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

type TabFilter = "all" | "active" | "inactive" | "expired";

function CouponsPage() {
	const [activeTab, setActiveTab] = React.useState<TabFilter>("all");
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const [newCoupon, setNewCoupon] = React.useState<NewCoupon>({
		code: "",
		type: "percentage",
		value: "",
		minOrderValue: "",
		currency: "BRL",
		expiresAt: "",
		hasNoLimit: false,
		usageLimit: "",
	});

	const data = React.useMemo(() => couponsData as Coupon[], []);

	const filteredData = React.useMemo(() => {
		const now = new Date();
		switch (activeTab) {
			case "active":
				return data.filter(
					(coupon) =>
						coupon.isActive &&
						(coupon.hasNoLimit ||
							coupon.expiresAt === null ||
							new Date(coupon.expiresAt) >= now),
				);
			case "inactive":
				return data.filter((coupon) => !coupon.isActive);
			case "expired":
				return data.filter(
					(coupon) =>
						coupon.expiresAt !== null && new Date(coupon.expiresAt) < now,
				);
			default:
				return data;
		}
	}, [data, activeTab]);

	const table = useReactTable({
		data: filteredData,
		columns,
		state: {
			sorting,
			columnFilters,
			rowSelection,
			pagination,
		},
		getRowId: (row) => row.id,
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const pageCount = table.getPageCount();
	const currentPage = table.getState().pagination.pageIndex + 1;

	const handleCreateCoupon = () => {
		// Here you would normally send to API
		console.log("Creating coupon:", newCoupon);
		setIsDialogOpen(false);
		setNewCoupon({
			code: "",
			type: "percentage",
			value: "",
			minOrderValue: "",
			currency: "BRL",
			expiresAt: "",
			hasNoLimit: false,
			usageLimit: "",
		});
	};

	const generateRandomCode = () => {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let code = "";
		for (let i = 0; i < 8; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		setNewCoupon((prev) => ({ ...prev, code }));
	};

	const renderCouponsTable = () => (
		<>
			<div className="overflow-hidden rounded-lg border bg-card">
				<Table>
					<TableHeader className="bg-muted/50">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="h-11">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="hover:bg-muted/30"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Nenhum cupom encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2">
					<Label htmlFor="page-size-coupons" className="sr-only">
						Items per page
					</Label>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => table.setPageSize(Number(value))}
					>
						<SelectTrigger
							className="w-fit gap-2"
							size="sm"
							id="page-size-coupons"
						>
							<SelectValue />
							<span className="text-muted-foreground">Cupons</span>
						</SelectTrigger>
						<SelectContent>
							{[10, 20, 30, 50].map((size) => (
								<SelectItem key={size} value={`${size}`}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="gap-1"
					>
						<IconChevronLeft className="size-4" />
						Anterior
					</Button>

					<div className="flex items-center gap-1">
						{Array.from(
							{ length: Math.min(3, pageCount) },
							(_, i) => i + 1,
						).map((page) => (
							<Button
								key={page}
								variant={currentPage === page ? "default" : "outline"}
								size="sm"
								className="size-8 p-0"
								onClick={() => table.setPageIndex(page - 1)}
							>
								{page}
							</Button>
						))}
						{pageCount > 3 && (
							<>
								<span className="px-2 text-muted-foreground">...</span>
								<Button
									variant={currentPage === pageCount ? "default" : "outline"}
									size="sm"
									className="size-8 p-0"
									onClick={() => table.setPageIndex(pageCount - 1)}
								>
									{pageCount}
								</Button>
							</>
						)}
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className="gap-1"
					>
						Próximo
						<IconChevronRight className="size-4" />
					</Button>
				</div>
			</div>
		</>
	);

	return (
		<div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">Cupons</h1>
					<p className="text-sm text-muted-foreground">
						Gerencie cupons de desconto para sua loja
					</p>
				</div>
				<Button onClick={() => setIsDialogOpen(true)}>
					<IconPlus className="mr-1.5 size-4" />
					Novo Cupom
				</Button>
			</div>

			{/* Stats */}
			<CouponStats coupons={data} />

			{/* Tabs with Content */}
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as TabFilter)}
				className="w-full"
			>
				<TabsList variant="line">
					<TabsTrigger value="all">Todos</TabsTrigger>
					<TabsTrigger value="active">Ativos</TabsTrigger>
					<TabsTrigger value="inactive">Inativos</TabsTrigger>
					<TabsTrigger value="expired">Expirados</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="mt-6 space-y-4">
					{renderCouponsTable()}
				</TabsContent>

				<TabsContent value="active" className="mt-6 space-y-4">
					{renderCouponsTable()}
				</TabsContent>

				<TabsContent value="inactive" className="mt-6 space-y-4">
					{renderCouponsTable()}
				</TabsContent>

				<TabsContent value="expired" className="mt-6 space-y-4">
					{renderCouponsTable()}
				</TabsContent>
			</Tabs>

			{/* Create Coupon Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Criar Novo Cupom</DialogTitle>
						<DialogDescription>
							Preencha as informações do cupom de desconto
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						{/* Coupon Code */}
						<div className="grid gap-2">
							<Label htmlFor="coupon-code">Código do Cupom</Label>
							<div className="flex gap-2">
								<Input
									id="coupon-code"
									placeholder="Ex: SAVE20"
									value={newCoupon.code}
									onChange={(e) =>
										setNewCoupon((prev) => ({
											...prev,
											code: e.target.value.toUpperCase(),
										}))
									}
									className="font-mono uppercase"
								/>
								<Button
									type="button"
									variant="outline"
									onClick={generateRandomCode}
								>
									Gerar
								</Button>
							</div>
						</div>

						{/* Discount Type */}
						<div className="grid gap-2">
							<Label htmlFor="coupon-type">Tipo de Desconto</Label>
							<Select
								value={newCoupon.type}
								onValueChange={(value: "percentage" | "fixed") =>
									setNewCoupon((prev) => ({ ...prev, type: value }))
								}
							>
								<SelectTrigger id="coupon-type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="percentage">
										<div className="flex items-center gap-2">
											<IconPercentage className="size-4" />
											Porcentagem
										</div>
									</SelectItem>
									<SelectItem value="fixed">
										<div className="flex items-center gap-2">
											<IconTag className="size-4" />
											Valor Fixo
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Discount Value and Currency */}
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="coupon-value">
									{newCoupon.type === "percentage"
										? "Porcentagem (%)"
										: "Valor do Desconto"}
								</Label>
								<Input
									id="coupon-value"
									type="number"
									placeholder={newCoupon.type === "percentage" ? "10" : "25.00"}
									value={newCoupon.value}
									onChange={(e) =>
										setNewCoupon((prev) => ({ ...prev, value: e.target.value }))
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="coupon-currency">Moeda</Label>
								<Select
									value={newCoupon.currency}
									onValueChange={(value) =>
										setNewCoupon((prev) => ({ ...prev, currency: value }))
									}
								>
									<SelectTrigger id="coupon-currency">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{CURRENCIES.map((c) => (
											<SelectItem key={c.value} value={c.value}>
												{c.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Minimum Order Value */}
						<div className="grid gap-2">
							<Label htmlFor="min-order">Valor Mínimo do Pedido</Label>
							<Input
								id="min-order"
								type="number"
								placeholder="0.00"
								value={newCoupon.minOrderValue}
								onChange={(e) =>
									setNewCoupon((prev) => ({
										...prev,
										minOrderValue: e.target.value,
									}))
								}
							/>
							<p className="text-xs text-muted-foreground">
								Deixe em branco ou 0 para sem valor mínimo
							</p>
						</div>

						{/* Expiry Date */}
						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="expires-at">Data de Expiração</Label>
								<div className="flex items-center gap-2">
									<Switch
										id="no-limit"
										checked={newCoupon.hasNoLimit}
										onCheckedChange={(checked) =>
											setNewCoupon((prev) => ({
												...prev,
												hasNoLimit: checked,
												expiresAt: checked ? "" : prev.expiresAt,
											}))
										}
									/>
									<Label htmlFor="no-limit" className="text-sm font-normal">
										Sem limite
									</Label>
								</div>
							</div>
							{!newCoupon.hasNoLimit && (
								<Input
									id="expires-at"
									type="date"
									value={newCoupon.expiresAt}
									onChange={(e) =>
										setNewCoupon((prev) => ({
											...prev,
											expiresAt: e.target.value,
										}))
									}
								/>
							)}
						</div>

						{/* Usage Limit */}
						<div className="grid gap-2">
							<Label htmlFor="usage-limit">Limite de Uso</Label>
							<Input
								id="usage-limit"
								type="number"
								placeholder="100"
								value={newCoupon.usageLimit}
								onChange={(e) =>
									setNewCoupon((prev) => ({
										...prev,
										usageLimit: e.target.value,
									}))
								}
							/>
							<p className="text-xs text-muted-foreground">
								Deixe em branco para uso ilimitado
							</p>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
							<IconX className="mr-1.5 size-4" />
							Cancelar
						</Button>
						<Button onClick={handleCreateCoupon} disabled={!newCoupon.code}>
							<IconPlus className="mr-1.5 size-4" />
							Criar Cupom
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
