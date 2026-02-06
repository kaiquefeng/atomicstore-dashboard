import { z } from "zod";

export const createStoreSchema = z.object({
	name: z.string().min(1, "Nome da loja é obrigatório"),
});

export type CreateStoreFormData = z.infer<typeof createStoreSchema>;
