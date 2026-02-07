"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
	type UploadedImage,
	uploadProductImagesAdapter,
} from "../adapters/upload-product-images.adapter";

export function useUploadProductImages() {
	return useMutation<UploadedImage[], Error, File[]>({
		mutationFn: uploadProductImagesAdapter,
		onError: (error) => {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao fazer upload das imagens. Tente novamente.";
			toast.error(errorMessage);
		},
	});
}
