"use client";

import { IconLoader } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { CustomDomainsSection } from "@/features/store-settings/components/custom-domains-section";
import { StoreBrandingSection } from "@/features/store-settings/components/store-branding-section";
import { StoreInfoSection } from "@/features/store-settings/components/store-info-section";
import { useStoreDetails } from "@/features/store-settings/hooks/use-store-details";
import { useStoreSlug } from "@/hooks/use-store-slug";
import { useStores } from "@/hooks/use-stores";

export const Route = createFileRoute("/$store/_layout/settings_/general")({
	component: GeneralSettingsPage,
});

function GeneralSettingsPage() {
	const storeSlug = useStoreSlug();
	const { stores, isLoading } = useStores();
	const { storeDetails, isLoading: isLoadingDetails } = useStoreDetails();

	const currentStore = React.useMemo(() => {
		if (!storeSlug) return null;
		return stores.find((store) => store.slug === storeSlug) || null;
	}, [storeSlug, stores]);

	if (isLoading || isLoadingDetails) {
		return (
			<div className="flex items-center justify-center h-64">
				<IconLoader className="size-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!currentStore) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-muted-foreground">Loja não encontrada.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
			<div>
				<h1 className="text-2xl font-semibold text-foreground">
					Configurações Gerais
				</h1>
				<p className="text-sm text-muted-foreground">
					Gerencie as informações e domínios da sua loja
				</p>
			</div>

			<StoreBrandingSection />

			<StoreInfoSection
				storeName={currentStore.name}
				storeSlug={currentStore.slug}
				storeDescription={storeDetails?.description}
				storeSocialLinks={storeDetails?.socialLinks}
			/>

			<CustomDomainsSection />
		</div>
	);
}
