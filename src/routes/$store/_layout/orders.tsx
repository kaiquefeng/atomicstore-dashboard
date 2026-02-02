"use client";

import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconDotsVertical,
	IconDownload,
	IconFilter,
	IconMail,
	IconMessage,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import ordersData from "@/constants/orders-data.json";

export const Route = createFileRoute("/$store/_layout/orders")({
	component: OrdersPage,
});

interface Order {
	id: string;
	orderNumber: string;
	itemsCount: number;
	thumbnail: string;
	customer: string;
	location: string;
	paymentStatus: "paid" | "pending" | "unpaid";
	date: string;
	fulfilmentStatus: "fulfilled" | "unfulfilled";
	total: number;
}

const stockStats = {
	total: 65,
	inStock: 30,
	lowStock: 10,
	outOfStock: 5,
};

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function formatCurrency(value: number): string {
	return `$${value.toFixed(2)}`;
}

function PaymentStatusBadge({ status }: { status: Order["paymentStatus"] }) {
	const variants: Record<
		Order["paymentStatus"],
		{ className: string; label: string }
	> = {
		paid: {
			className:
				"bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
			label: "Paid",
		},
		pending: {
			className:
				"bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
			label: "Pending",
		},
		unpaid: {
			className:
				"bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700",
			label: "Unpaid",
		},
	};

	const variant = variants[status];

	return (
		<Badge variant="outline" className={variant.className}>
			{variant.label}
		</Badge>
	);
}

function FulfilmentStatusBadge({
	status,
}: {
	status: Order["fulfilmentStatus"];
}) {
	const variants: Record<
		Order["fulfilmentStatus"],
		{ dotColor: string; label: string }
	> = {
		fulfilled: {
			dotColor: "bg-emerald-500",
			label: "Fulfilled",
		},
		unfulfilled: {
			dotColor: "bg-amber-500",
			label: "Unfulfilled",
		},
	};

	const variant = variants[status];

	return (
		<div className="flex items-center gap-2">
			<span className={`size-2 rounded-full ${variant.dotColor}`} />
			<span
				className={
					status === "fulfilled"
						? "text-emerald-600 dark:text-emerald-400"
						: "text-amber-600 dark:text-amber-400"
				}
			>
				{variant.label}
			</span>
		</div>
	);
}

function StockIndicator() {
	const { inStock, lowStock, outOfStock, total } = stockStats;
	const inStockPercent = (inStock / total) * 100;
	const lowStockPercent = (lowStock / total) * 100;

	return (
		<div className="flex flex-col items-end gap-1">
			<span className="text-sm font-medium text-foreground">
				{total} products
			</span>
			<div className="flex h-2 w-48 overflow-hidden rounded-full">
				<div
					className="bg-emerald-500"
					style={{ width: `${inStockPercent}%` }}
				/>
				<div
					className="bg-amber-500"
					style={{ width: `${lowStockPercent}%` }}
				/>
				<div className="flex-1 bg-rose-500" />
			</div>
			<div className="flex gap-4 text-xs text-muted-foreground">
				<span className="flex items-center gap-1">
					<span className="size-2 rounded-full bg-emerald-500" />
					In stock: {inStock}
				</span>
				<span className="flex items-center gap-1">
					<span className="size-2 rounded-full bg-amber-500" />
					Low stock: {lowStock}
				</span>
				<span className="flex items-center gap-1">
					<span className="size-2 rounded-full bg-rose-500" />
					Out of stock: {outOfStock}
				</span>
			</div>
		</div>
	);
}

const columns: ColumnDef<Order>[] = [
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
		accessorKey: "orderNumber",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3 h-8 data-[state=open]:bg-accent"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Order ID
				<IconChevronDown
					className={`ml-1 size-4 transition-transform ${
						column.getIsSorted() === "asc" ? "rotate-180" : ""
					}`}
				/>
			</Button>
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<img
					src={row.original.thumbnail}
					alt=""
					className="size-10 rounded-lg object-cover"
				/>
				<div className="flex flex-col">
					<span className="font-medium text-foreground">
						{row.original.orderNumber}
					</span>
					<span className="text-xs text-muted-foreground">
						{row.original.itemsCount} items
					</span>
				</div>
			</div>
		),
	},
	{
		accessorKey: "customer",
		header: "Customer",
		cell: ({ row }) => (
			<span className="text-foreground">{row.original.customer}</span>
		),
	},
	{
		accessorKey: "location",
		header: "Location",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<span className="max-w-[150px] truncate text-muted-foreground">
					{row.original.location}
				</span>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="ghost" size="icon" className="size-6">
							<IconMail className="size-4 text-muted-foreground" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Send email</TooltipContent>
				</Tooltip>
			</div>
		),
	},
	{
		accessorKey: "paymentStatus",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3 h-8 data-[state=open]:bg-accent"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Payment Status
				<IconChevronDown
					className={`ml-1 size-4 transition-transform ${
						column.getIsSorted() === "asc" ? "rotate-180" : ""
					}`}
				/>
			</Button>
		),
		cell: ({ row }) => (
			<PaymentStatusBadge status={row.original.paymentStatus} />
		),
	},
	{
		accessorKey: "date",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3 h-8 data-[state=open]:bg-accent"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Date
				<IconChevronDown
					className={`ml-1 size-4 transition-transform ${
						column.getIsSorted() === "asc" ? "rotate-180" : ""
					}`}
				/>
			</Button>
		),
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{formatDate(row.original.date)}
			</span>
		),
	},
	{
		accessorKey: "fulfilmentStatus",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3 h-8 data-[state=open]:bg-accent"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Fulfilment Status
				<IconChevronDown
					className={`ml-1 size-4 transition-transform ${
						column.getIsSorted() === "asc" ? "rotate-180" : ""
					}`}
				/>
			</Button>
		),
		cell: ({ row }) => (
			<FulfilmentStatusBadge status={row.original.fulfilmentStatus} />
		),
	},
	{
		accessorKey: "total",
		header: () => <div className="text-right">Total</div>,
		cell: ({ row }) => (
			<div className="text-right font-medium text-foreground">
				{formatCurrency(row.original.total)}
			</div>
		),
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
						<IconMessage className="mr-2 size-4" />
						View details
					</DropdownMenuItem>
					<DropdownMenuItem>
						<IconMail className="mr-2 size-4" />
						Contact customer
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-destructive">
						Cancel order
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];

type TabFilter = "all" | "open" | "unfulfilled" | "unpaid";

function OrdersPage() {
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

	const data = React.useMemo(() => ordersData as Order[], []);

	const filteredData = React.useMemo(() => {
		switch (activeTab) {
			case "open":
				return data.filter(
					(order) =>
						order.paymentStatus === "paid" &&
						order.fulfilmentStatus === "unfulfilled",
				);
			case "unfulfilled":
				return data.filter((order) => order.fulfilmentStatus === "unfulfilled");
			case "unpaid":
				return data.filter(
					(order) =>
						order.paymentStatus === "unpaid" ||
						order.paymentStatus === "pending",
				);
			default:
				return data;
		}
	}, [data, activeTab]);

	const totalOrders = data.length;

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

	const renderOrdersTable = () => (
		<>
			{/* Table */}
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
									No orders found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2">
					<Label htmlFor="page-size" className="sr-only">
						Documents per page
					</Label>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => table.setPageSize(Number(value))}
					>
						<SelectTrigger className="w-fit gap-2" size="sm" id="page-size">
							<SelectValue />
							<span className="text-muted-foreground">Documents</span>
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
						Previous
					</Button>

					{/* Page numbers */}
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
						Next
						<IconChevronRight className="size-4" />
					</Button>
				</div>
			</div>
		</>
	);

	return (
		<div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">
						Orders{" "}
						<span className="text-muted-foreground">({totalOrders})</span>
					</h1>
				</div>
				<StockIndicator />
			</div>

			{/* Tabs with Content */}
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as TabFilter)}
				className="w-full"
			>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<TabsList variant="line">
						<TabsTrigger value="all">All Order</TabsTrigger>
						<TabsTrigger value="open">Open</TabsTrigger>
						<TabsTrigger value="unfulfilled">Unfulfilled</TabsTrigger>
						<TabsTrigger value="unpaid">Unpaid</TabsTrigger>
					</TabsList>

					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm">
							<IconFilter className="mr-1.5 size-4" />
							Filter
						</Button>
						<Button variant="outline" size="sm">
							<IconDownload className="mr-1.5 size-4" />
							Export
						</Button>
					</div>
				</div>

				<TabsContent value="all" className="mt-6 space-y-4">
					{renderOrdersTable()}
				</TabsContent>

				<TabsContent value="open" className="mt-6 space-y-4">
					{renderOrdersTable()}
				</TabsContent>

				<TabsContent value="unfulfilled" className="mt-6 space-y-4">
					{renderOrdersTable()}
				</TabsContent>

				<TabsContent value="unpaid" className="mt-6 space-y-4">
					{renderOrdersTable()}
				</TabsContent>
			</Tabs>
		</div>
	);
}
