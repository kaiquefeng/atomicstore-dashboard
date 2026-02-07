import { z } from "zod";

export const createProductSchema = z.object({
	title: z.string().min(1, "Título do produto é obrigatório"),
	description: z.string().optional(),
	status: z.enum(["draft", "active", "archived"]).default("draft"),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
