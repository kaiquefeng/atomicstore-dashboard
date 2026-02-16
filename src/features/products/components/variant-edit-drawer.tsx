"use client";

import {
        IconChevronLeft,
        IconChevronRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
        Drawer,
        DrawerClose,
        DrawerContent,
        DrawerFooter,
        DrawerHeader,
        DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ProductVariant } from "@/features/products/schemas/product-form";

interface VariantEditDrawerProps {
        editVariantId: string | null;
        onClose: () => void;
        onNavigate: (variantId: string) => void;
        variants: ProductVariant[];
        onUpdateVariant: (id: string, updates: Partial<ProductVariant>) => void;
        isPending?: boolean;
}

export function VariantEditDrawer({
        editVariantId,
        onClose,
        onNavigate,
        variants,
        onUpdateVariant,
        isPending,
}: VariantEditDrawerProps) {
        const editingVariant = variants.find((v) => v.id === editVariantId);
        const currentIndex = variants.findIndex((v) => v.id === editVariantId);
        const prevVariant =
                currentIndex > 0 ? variants[currentIndex - 1] : null;
        const nextVariant =
                currentIndex < variants.length - 1
                        ? variants[currentIndex + 1]
                        : null;

        const cost = editingVariant ? Number(editingVariant.costBrl) || 0 : 0;
        const price = editingVariant ? Number(editingVariant.priceBrl) || 0 : 0;
        const margin =
                price > 0 ? Math.round(((price - cost) / price) * 100) : 0;

        return (
                <Drawer
                        direction="right"
                        open={!!editVariantId}
                        onOpenChange={(open) => {
                                if (!open) onClose();
                        }}
                >
                        <DrawerContent className="h-full w-full max-w-md ml-auto">
                                {editingVariant ? (
                                        <>
                                                <DrawerHeader className="border-b">
                                                        <div className="flex items-center justify-between">
                                                                <DrawerClose asChild>
                                                                        <Button variant="ghost" size="icon">
                                                                                <IconChevronLeft className="size-5" />
                                                                        </Button>
                                                                </DrawerClose>
                                                                <DrawerTitle className="text-xl font-bold">
                                                                        {editingVariant.title || "Variação"}
                                                                </DrawerTitle>
                                                                <div className="flex items-center gap-1">
                                                                        <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                disabled={!prevVariant}
                                                                                onClick={() =>
                                                                                        prevVariant && onNavigate(prevVariant.id)
                                                                                }
                                                                        >
                                                                                <IconChevronLeft className="size-4" />
                                                                        </Button>
                                                                        <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                disabled={!nextVariant}
                                                                                onClick={() =>
                                                                                        nextVariant && onNavigate(nextVariant.id)
                                                                                }
                                                                        >
                                                                                <IconChevronRight className="size-4" />
                                                                        </Button>
                                                                </div>
                                                        </div>
                                                </DrawerHeader>

                                                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                                        <Card>
                                                                <CardHeader className="pb-4">
                                                                        <CardTitle className="text-lg">Preços</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                <div className="space-y-2">
                                                                                        <Label className="text-sm">Preço de venda</Label>
                                                                                        <div className="relative">
                                                                                                <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                                                                                                        R$
                                                                                                </span>
                                                                                                <Input
                                                                                                        type="number"
                                                                                                        step="0.01"
                                                                                                        placeholder="0.00"
                                                                                                        value={editingVariant.priceBrl}
                                                                                                        onChange={(e) =>
                                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                                        priceBrl: e.target.value,
                                                                                                                })
                                                                                                        }
                                                                                                        className="pl-10"
                                                                                                />
                                                                                        </div>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                        <Label className="text-sm">
                                                                                                Preço promocional
                                                                                        </Label>
                                                                                        <div className="relative">
                                                                                                <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                                                                                                        R$
                                                                                                </span>
                                                                                                <Input
                                                                                                        type="number"
                                                                                                        step="0.01"
                                                                                                        placeholder="0.00"
                                                                                                        value={editingVariant.compareAtBrl}
                                                                                                        onChange={(e) =>
                                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                                        compareAtBrl: e.target.value,
                                                                                                                })
                                                                                                        }
                                                                                                        className="pl-10"
                                                                                                />
                                                                                        </div>
                                                                                </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2">
                                                                                <Checkbox
                                                                                        id="show-price"
                                                                                        checked={editingVariant.showPrice}
                                                                                        onCheckedChange={(checked) =>
                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                        showPrice: !!checked,
                                                                                                })
                                                                                        }
                                                                                />
                                                                                <Label htmlFor="show-price" className="text-sm">
                                                                                        Exibir o preço na loja
                                                                                </Label>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                <div className="space-y-2">
                                                                                        <Label className="text-sm">Custo</Label>
                                                                                        <div className="relative">
                                                                                                <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                                                                                                        R$
                                                                                                </span>
                                                                                                <Input
                                                                                                        type="number"
                                                                                                        step="0.01"
                                                                                                        placeholder="0.00"
                                                                                                        value={editingVariant.costBrl}
                                                                                                        onChange={(e) =>
                                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                                        costBrl: e.target.value,
                                                                                                                })
                                                                                                        }
                                                                                                        className="pl-10"
                                                                                                />
                                                                                        </div>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                        <div className="flex items-center gap-1">
                                                                                                <Label className="text-sm">
                                                                                                        Margem de lucro
                                                                                                </Label>
                                                                                                <Tooltip>
                                                                                                        <TooltipTrigger>
                                                                                                                <span className="text-muted-foreground text-xs cursor-help">
                                                                                                                        ⓘ
                                                                                                                </span>
                                                                                                        </TooltipTrigger>
                                                                                                        <TooltipContent>
                                                                                                                Calculado automaticamente com base no preço
                                                                                                                e custo
                                                                                                        </TooltipContent>
                                                                                                </Tooltip>
                                                                                        </div>
                                                                                        <Input
                                                                                                type="text"
                                                                                                value={`${margin} %`}
                                                                                                disabled
                                                                                                className="bg-muted"
                                                                                        />
                                                                                </div>
                                                                        </div>

                                                                        <p className="text-muted-foreground text-xs">
                                                                                É para uso interno, os seus clientes não o verão na
                                                                                loja.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>

                                                        <Card>
                                                                <CardHeader className="pb-4">
                                                                        <CardTitle className="text-lg">Códigos</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <div className="space-y-2">
                                                                                <Label className="text-sm">SKU</Label>
                                                                                <Input
                                                                                        placeholder="SENDIT-BP-2026"
                                                                                        value={editingVariant.sku}
                                                                                        onChange={(e) =>
                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                        sku: e.target.value,
                                                                                                })
                                                                                        }
                                                                                />
                                                                                <p className="text-muted-foreground text-xs">
                                                                                        SKU é um código que você cria internamente para
                                                                                        ter o controle dos seus produtos com variações.
                                                                                </p>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                                <Label className="text-sm">Código de barras</Label>
                                                                                <Input
                                                                                        placeholder=""
                                                                                        value={editingVariant.barcode}
                                                                                        onChange={(e) =>
                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                        barcode: e.target.value,
                                                                                                })
                                                                                        }
                                                                                />
                                                                                <p className="text-muted-foreground text-xs">
                                                                                        O código de barras é composto por 13 números e
                                                                                        serve para identificar um produto.
                                                                                </p>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>

                                                        <Card>
                                                                <CardHeader className="pb-4">
                                                                        <CardTitle className="text-lg">
                                                                                Peso e dimensões
                                                                        </CardTitle>
                                                                        <CardDescription>
                                                                                Preencha os dados para calcular o custo de envio dos
                                                                                produtos e mostrar os meios de envio na sua loja.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                <div className="space-y-2">
                                                                                        <Label className="text-sm">Peso</Label>
                                                                                        <div className="relative">
                                                                                                <Input
                                                                                                        type="number"
                                                                                                        step="0.001"
                                                                                                        placeholder="0.000"
                                                                                                        value={editingVariant.weightKg}
                                                                                                        onChange={(e) =>
                                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                                        weightKg: e.target.value,
                                                                                                                })
                                                                                                        }
                                                                                                        className="pr-10"
                                                                                                />
                                                                                                <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                                                                                                        kg
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                        <Label className="text-sm">Comprimento</Label>
                                                                                        <div className="relative">
                                                                                                <Input
                                                                                                        type="number"
                                                                                                        step="0.01"
                                                                                                        placeholder="0.00"
                                                                                                        value={editingVariant.lengthCm}
                                                                                                        onChange={(e) =>
                                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                                        lengthCm: e.target.value,
                                                                                                                })
                                                                                                        }
                                                                                                        className="pr-10"
                                                                                                />
                                                                                                <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                                                                                                        cm
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 gap-4">
                                                                                <div className="space-y-2">
                                                                                        <Label className="text-sm">Largura</Label>
                                                                                        <div className="relative">
                                                                                                <Input
                                                                                                        type="number"
                                                                                                        step="0.01"
                                                                                                        placeholder="0.00"
                                                                                                        value={editingVariant.widthCm}
                                                                                                        onChange={(e) =>
                                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                                        widthCm: e.target.value,
                                                                                                                })
                                                                                                        }
                                                                                                        className="pr-10"
                                                                                                />
                                                                                                <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                                                                                                        cm
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                        <Label className="text-sm">Altura</Label>
                                                                                        <div className="relative">
                                                                                                <Input
                                                                                                        type="number"
                                                                                                        step="0.01"
                                                                                                        placeholder="0.00"
                                                                                                        value={editingVariant.heightCm}
                                                                                                        onChange={(e) =>
                                                                                                                onUpdateVariant(editingVariant.id, {
                                                                                                                        heightCm: e.target.value,
                                                                                                                })
                                                                                                        }
                                                                                                        className="pr-10"
                                                                                                />
                                                                                                <span className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                                                                                                        cm
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                </div>

                                                <DrawerFooter className="border-t">
                                                        <DrawerClose asChild>
                                                                <Button disabled={isPending}>
                                                                        {isPending ? "Salvando..." : "Salvar"}
                                                                </Button>
                                                        </DrawerClose>
                                                </DrawerFooter>
                                        </>
                                ) : null}
                        </DrawerContent>
                </Drawer>
        );
}
