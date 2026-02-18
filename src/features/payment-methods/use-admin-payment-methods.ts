"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import toast from "react-hot-toast";

import { createAdminPaymentMethodAdapter } from "./adapters/create-admin-payment-method.adapter";
import { deleteAdminPaymentMethodAdapter } from "./adapters/delete-admin-payment-method.adapter";
import { getAdminPaymentMethodsAdapter } from "./adapters/get-admin-payment-methods.adapter";
import { updateAdminPaymentMethodAdapter } from "./adapters/update-admin-payment-method.adapter";
import type { PaymentMethod } from "./types";

export type { PaymentMethod };

type ConfigPair = { id: string; key: string; value: string };

function nextPairId() {
	return `pair-${crypto.randomUUID()}`;
}

function toConfigPairs(metadata: Record<string, string>): ConfigPair[] {
	const entries = Object.entries(metadata);
	if (entries.length === 0) return [{ id: nextPairId(), key: "", value: "" }];
	return entries.map(([key, value]) => ({ id: nextPairId(), key, value }));
}

function resetForm() {
	return {
		formName: "",
		formSlug: "",
		formConfigPairs: [{ id: nextPairId(), key: "", value: "" }] as ConfigPair[],
		editingMethodId: null as string | null,
	};
}

type UseAdminPaymentMethodsResult = {
	methods: PaymentMethod[];
	isLoading: boolean;
	isCreating: boolean;
	isUpdating: boolean;
	isDeleting: boolean;
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
	editingMethodId: string | null;
	formName: string;
	setFormName: (value: string) => void;
	formSlug: string;
	setFormSlug: (value: string) => void;
	formConfigPairs: ConfigPair[];
	handleConfigPairChange: (
		index: number,
		field: "key" | "value",
		value: string,
	) => void;
	handleAddConfigPairRow: () => void;
	handleRemoveConfigPairRow: (index: number) => void;
	openCreateDialog: () => void;
	openEditDialog: (method: PaymentMethod) => void;
	handleSubmitMethod: () => Promise<void>;
	handleRemoveMethod: (id: string) => void;
};

export function useAdminPaymentMethods(): UseAdminPaymentMethodsResult {
	const queryClient = useQueryClient();

	const { data: methods = [], isLoading } = useQuery({
		queryKey: ["admin-payment-methods"],
		queryFn: getAdminPaymentMethodsAdapter,
	});

	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [editingMethodId, setEditingMethodId] = React.useState<string | null>(
		null,
	);
	const [formName, setFormName] = React.useState("");
	const [formSlug, setFormSlug] = React.useState("");
	const [formConfigPairs, setFormConfigPairs] = React.useState<ConfigPair[]>(() => [
		{ id: nextPairId(), key: "", value: "" },
	]);

	const invalidate = () =>
		queryClient.invalidateQueries({ queryKey: ["admin-payment-methods"] });

	const createMutation = useMutation({
		mutationFn: createAdminPaymentMethodAdapter,
		onSuccess: () => {
			invalidate();
			toast.success("Método de pagamento cadastrado com sucesso!");
		},
		onError: (error: Error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Erro ao cadastrar método. Tente novamente.",
			);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: { name: string; slug: string; metadata: Record<string, string> };
		}) => updateAdminPaymentMethodAdapter(id, payload),
		onSuccess: () => {
			invalidate();
			toast.success("Método de pagamento atualizado com sucesso!");
		},
		onError: (error: Error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Erro ao atualizar método. Tente novamente.",
			);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteAdminPaymentMethodAdapter,
		onSuccess: () => {
			invalidate();
			toast.success("Método de pagamento excluído.");
		},
		onError: (error: Error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Erro ao excluir método. Tente novamente.",
			);
		},
	});

	function handleConfigPairChange(
		index: number,
		field: "key" | "value",
		value: string,
	) {
		setFormConfigPairs((prev) =>
			prev.map((pair, i) => (i === index ? { ...pair, [field]: value } : pair)),
		);
	}

	function handleAddConfigPairRow() {
		setFormConfigPairs((prev) => [
			...prev,
			{ id: nextPairId(), key: "", value: "" },
		]);
	}

	function handleRemoveConfigPairRow(index: number) {
		setFormConfigPairs((prev) =>
			prev.length === 1
				? [{ id: nextPairId(), key: "", value: "" }]
				: prev.filter((_, i) => i !== index),
		);
	}

	function openCreateDialog() {
		const { formName: n, formSlug: s, formConfigPairs: p } = resetForm();
		setFormName(n);
		setFormSlug(s);
		setFormConfigPairs(p);
		setEditingMethodId(null);
		setDialogOpen(true);
	}

	function openEditDialog(method: PaymentMethod) {
		setFormName(method.name);
		setFormSlug(method.slug);
		setFormConfigPairs(toConfigPairs(method.metadata ?? {}));
		setEditingMethodId(method.id);
		setDialogOpen(true);
	}

	async function handleSubmitMethod() {
		if (!formName.trim()) return;
		const slug =
			formSlug.trim() || formName.toLowerCase().replace(/\s+/g, "_");
		const metadata = formConfigPairs
			.filter((pair) => pair.key.trim())
			.reduce(
				(acc, pair) => {
					acc[pair.key.trim()] = pair.value.trim();
					return acc;
				},
				{} as Record<string, string>,
			);

		if (editingMethodId) {
			await updateMutation.mutateAsync({
				id: editingMethodId,
				payload: { name: formName.trim(), slug, metadata },
			});
		} else {
			await createMutation.mutateAsync({
				name: formName.trim(),
				slug,
				metadata,
			});
		}

		const { formName: n, formSlug: s, formConfigPairs: p } = resetForm();
		setFormName(n);
		setFormSlug(s);
		setFormConfigPairs(p);
		setEditingMethodId(null);
		setDialogOpen(false);
	}

	function handleRemoveMethod(id: string) {
		if (!window.confirm("Tem certeza que deseja excluir este método?")) return;
		deleteMutation.mutate(id);
	}

	const isCreating = createMutation.isPending;
	const isUpdating = updateMutation.isPending;
	const isDeleting = deleteMutation.isPending;

	return {
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
	};
}
