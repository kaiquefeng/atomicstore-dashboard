export const convertToSlug = (name: string) => {
	return name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
};

export const generateSKU = (title: string, variantIndex?: number): string => {
	if (!title || title.trim() === "") {
		return "";
	}

	const baseSKU = title
		.toUpperCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^A-Z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")
		.substring(0, 10); // Limitar a 10 caracteres

	// Adicionar timestamp para garantir unicidade
	const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos

	// Se houver variantIndex, adicionar ao final
	const variantSuffix =
		variantIndex !== undefined ? `-V${variantIndex + 1}` : "";

	return `${baseSKU}-${timestamp}${variantSuffix}`;
};

export const generateBarcode = (variantIndex?: number): string => {
	// Gera um código de barras numérico de 13 dígitos (formato EAN-13)
	// Usa timestamp + índice da variação para garantir unicidade
	const timestamp = Date.now().toString();
	const variantSuffix =
		variantIndex !== undefined
			? String(variantIndex + 1).padStart(2, "0")
			: "00";

	// Combina timestamp (últimos 10 dígitos) + sufixo da variação (2 dígitos) + dígito verificador (1 dígito)
	const base = (timestamp.slice(-10) + variantSuffix).slice(0, 12);

	// Calcula dígito verificador (algoritmo EAN-13 simplificado)
	let sum = 0;
	for (let i = 0; i < 12; i++) {
		const digit = parseInt(base[i], 10);
		sum += i % 2 === 0 ? digit : digit * 3;
	}
	const checkDigit = (10 - (sum % 10)) % 10;

	return base + checkDigit;
};
