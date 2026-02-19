import { z } from "zod";

const socialLinkItemSchema = z.object({
	network: z.string(),
	value: z.string(),
});

export const updateStoreSchema = z.object({
	name: z.string().min(1, "Nome da loja é obrigatório"),
	slug: z
		.string()
		.min(1, "Slug é obrigatório")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug deve conter apenas letras minúsculas, números e hífens",
		),
	description: z.string().default(""),
	socialLinks: z.array(socialLinkItemSchema).default([]),
});

export type UpdateStoreFormData = z.infer<typeof updateStoreSchema>;

export const addDomainSchema = z.object({
	host: z
		.string()
		.min(1, "Domínio é obrigatório")
		.max(255, "Domínio deve ter no máximo 255 caracteres")
		.regex(
			/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
			"Insira um domínio válido (ex: minha-loja.com.br)",
		),
	setAsPrimary: z.boolean(),
});

export type AddDomainFormData = z.infer<typeof addDomainSchema>;
