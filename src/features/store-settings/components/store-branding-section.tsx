"use client";

import {
	IconLoader,
	IconPhoto,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	useStoreDetails,
	useUploadStoreBanners,
	useUploadStoreFavicon,
	useUploadStoreLogo,
} from "../hooks";

export function StoreBrandingSection() {
	const { storeDetails, isLoading: isLoadingDetails } = useStoreDetails();
	const uploadLogoMutation = useUploadStoreLogo();
	const uploadFaviconMutation = useUploadStoreFavicon();
	const uploadBannersMutation = useUploadStoreBanners();

	const logoInputRef = React.useRef<HTMLInputElement>(null);
	const faviconInputRef = React.useRef<HTMLInputElement>(null);
	const bannersInputRef = React.useRef<HTMLInputElement>(null);

	const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
	const [faviconPreview, setFaviconPreview] = React.useState<string | null>(
		null,
	);
	const [isLogoDragging, setIsLogoDragging] = React.useState(false);
	const [isFaviconDragging, setIsFaviconDragging] = React.useState(false);
	const [isBannersDragging, setIsBannersDragging] = React.useState(false);

	const logoUrl = logoPreview ?? storeDetails?.logo ?? null;
	const faviconUrl =
		faviconPreview ?? (storeDetails as { favicon?: string })?.favicon ?? null;
	const banners = storeDetails?.banners ?? [];

	React.useEffect(() => {
		return () => {
			if (logoPreview) URL.revokeObjectURL(logoPreview);
			if (faviconPreview) URL.revokeObjectURL(faviconPreview);
		};
	}, [logoPreview, faviconPreview]);

	function handleLogoFileSelect(file: File) {
		if (!file.type.startsWith("image/")) return;
		setLogoPreview(URL.createObjectURL(file));
		uploadLogoMutation.mutate(file);
	}

	function handleLogoInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) handleLogoFileSelect(file);
		e.target.value = "";
	}

	function handleLogoDragOver(e: React.DragEvent) {
		e.preventDefault();
		setIsLogoDragging(true);
	}

	function handleLogoDragLeave(e: React.DragEvent) {
		e.preventDefault();
		setIsLogoDragging(false);
	}

	function handleLogoDrop(e: React.DragEvent) {
		e.preventDefault();
		setIsLogoDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) handleLogoFileSelect(file);
	}

	function handleFaviconFileSelect(file: File) {
		if (!file.type.startsWith("image/")) return;
		setFaviconPreview(URL.createObjectURL(file));
		uploadFaviconMutation.mutate(file);
	}

	function handleFaviconInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) handleFaviconFileSelect(file);
		e.target.value = "";
	}

	function handleFaviconDragOver(e: React.DragEvent) {
		e.preventDefault();
		setIsFaviconDragging(true);
	}

	function handleFaviconDragLeave(e: React.DragEvent) {
		e.preventDefault();
		setIsFaviconDragging(false);
	}

	function handleFaviconDrop(e: React.DragEvent) {
		e.preventDefault();
		setIsFaviconDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (file) handleFaviconFileSelect(file);
	}

	function handleBannersFileSelect(files: File[]) {
		const imageFiles = files.filter((f) => f.type.startsWith("image/"));
		if (imageFiles.length === 0) return;
		uploadBannersMutation.mutate(imageFiles);
	}

	function handleBannersInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (files?.length) handleBannersFileSelect(Array.from(files));
		e.target.value = "";
	}

	function handleBannersDragOver(e: React.DragEvent) {
		e.preventDefault();
		setIsBannersDragging(true);
	}

	function handleBannersDragLeave(e: React.DragEvent) {
		e.preventDefault();
		setIsBannersDragging(false);
	}

	function handleBannersDrop(e: React.DragEvent) {
		e.preventDefault();
		setIsBannersDragging(false);
		if (uploadBannersMutation.isPending) return;
		const files = Array.from(e.dataTransfer.files);
		if (files.length) handleBannersFileSelect(files);
	}

	function handleRemoveBanner(_url: string) {
		// TODO: requires DELETE or PATCH endpoint for removing individual banners
	}

	if (isLoadingDetails && !storeDetails) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-12">
					<IconLoader className="size-6 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<IconPhoto className="size-5" />
					Visual da Loja
				</CardTitle>
				<CardDescription>
					Envie o logo, favicon e os banners da sua loja. O logo aparece no
					cabeçalho da loja, o favicon aparece na aba do navegador e os banners
					podem ser exibidos na página inicial.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Logo and Favicon section */}
				<div className="flex flex-col gap-6 md:flex-row">
					{/* Logo section */}
					<div className="space-y-3">
						<h3 className="text-sm font-medium">Logo</h3>
						<input
							type="file"
							ref={logoInputRef}
							onChange={handleLogoInputChange}
							accept="image/*"
							className="hidden"
						/>
						<button
							type="button"
							onClick={() => logoInputRef.current?.click()}
							onDragOver={handleLogoDragOver}
							onDragLeave={handleLogoDragLeave}
							onDrop={handleLogoDrop}
							className={`flex aspect-[3/1] min-h-24 w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
								isLogoDragging
									? "border-primary bg-primary/10"
									: "border-muted-foreground/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
							}`}
						>
							{uploadLogoMutation.isPending ? (
								<IconLoader className="size-8 animate-spin text-muted-foreground" />
							) : logoUrl ? (
								<img
									src={logoUrl}
									alt="Logo da loja"
									className="max-h-full w-auto object-contain p-2"
								/>
							) : (
								<div className="flex flex-col items-center gap-1 text-center text-sm text-muted-foreground">
									<IconPhoto className="size-8" />
									<span>Clique ou arraste para enviar o logo</span>
								</div>
							)}
						</button>
					</div>

					{/* Favicon section */}
					<div className="space-y-3">
						<h3 className="text-sm font-medium">Favicon</h3>
						<input
							type="file"
							ref={faviconInputRef}
							onChange={handleFaviconInputChange}
							accept="image/*"
							className="hidden"
						/>
						<button
							type="button"
							onClick={() => faviconInputRef.current?.click()}
							onDragOver={handleFaviconDragOver}
							onDragLeave={handleFaviconDragLeave}
							onDrop={handleFaviconDrop}
							className={`flex aspect-[3/1] min-h-24 w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
								isFaviconDragging
									? "border-primary bg-primary/10"
									: "border-muted-foreground/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
							}`}
						>
							{uploadFaviconMutation.isPending ? (
								<IconLoader className="size-8 animate-spin text-muted-foreground" />
							) : faviconUrl ? (
								<img
									src={faviconUrl}
									alt="Favicon da loja"
									className="max-h-full w-auto object-contain p-2"
								/>
							) : (
								<div className="flex flex-col items-center gap-1 text-center text-sm text-muted-foreground">
									<IconPhoto className="size-8" />
									<span>Clique ou arraste para enviar o favicon</span>
								</div>
							)}
						</button>
					</div>
				</div>

				<Separator />

				{/* Banners section */}
				<div className="space-y-3">
					<h3 className="text-sm font-medium">Banners</h3>
					<input
						type="file"
						ref={bannersInputRef}
						onChange={handleBannersInputChange}
						accept="image/*"
						multiple
						className="hidden"
					/>
					<div
						onClick={() =>
							!uploadBannersMutation.isPending &&
							bannersInputRef.current?.click()
						}
						onDragOver={handleBannersDragOver}
						onDragLeave={handleBannersDragLeave}
						onDrop={handleBannersDrop}
						className={`flex min-h-28 w-full flex-wrap items-center gap-3 rounded-xl border-2 border-dashed p-4 transition-colors ${
							uploadBannersMutation.isPending
								? "cursor-not-allowed border-muted-foreground/20 bg-muted/20"
								: isBannersDragging
									? "cursor-pointer border-primary bg-primary/10"
									: "cursor-pointer border-muted-foreground/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
						}`}
					>
						{banners.map((url) => (
							<div
								key={url}
								className="group relative aspect-[3/1] w-48 shrink-0 overflow-hidden rounded-lg bg-muted"
							>
								<img
									src={url}
									alt="Banner"
									className="size-full object-cover"
								/>
								<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="text-white hover:bg-white/20 hover:text-white"
												onClick={(e) => {
													e.stopPropagation();
													handleRemoveBanner(url);
												}}
											>
												<IconTrash className="size-5" />
												<span className="sr-only">Remover banner</span>
											</Button>
										</TooltipTrigger>
										<TooltipContent>Remover banner</TooltipContent>
									</Tooltip>
								</div>
							</div>
						))}
						{uploadBannersMutation.isPending ? (
							<div className="flex aspect-[3/1] w-48 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
								<IconLoader className="size-6 animate-spin text-muted-foreground" />
							</div>
						) : (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className="aspect-[3/1] h-auto w-48 shrink-0 flex-col gap-1 rounded-lg border-2 border-dashed"
									>
										<IconPlus className="size-6" />
										<span className="text-xs">Adicionar banner</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Adicionar banner</TooltipContent>
							</Tooltip>
						)}
					</div>
					{isBannersDragging && (
						<p className="text-center text-sm text-primary">
							Solte as imagens aqui para enviar
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
