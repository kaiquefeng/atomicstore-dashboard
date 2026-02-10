"use client";

import { IconPlus } from "@tabler/icons-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VariantValueInputProps {
	optionName: string;
	onAdd: (value: string) => void;
}

export function VariantValueInput({
	optionName,
	onAdd,
}: VariantValueInputProps) {
	const [value, setValue] = React.useState("");
	const [isAdding, setIsAdding] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	function handleSubmit(e?: React.FormEvent) {
		if (e) {
			e.preventDefault();
		}
		if (value.trim()) {
			onAdd(value.trim());
			setValue("");
			setIsAdding(false);
		} else {
			setIsAdding(false);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit();
		} else if (e.key === "Escape") {
			setValue("");
			setIsAdding(false);
		}
	}

	function handleBlur() {
		setTimeout(() => {
			if (value.trim()) {
				handleSubmit();
			} else {
				setIsAdding(false);
			}
		}, 200);
	}

	if (!isAdding) {
		return (
			<Button
				type="button"
				variant="outline"
				size="xs"
				onClick={() => {
					setIsAdding(true);
					setTimeout(() => {
						inputRef.current?.focus();
					}, 0);
				}}
				className="border-dashed"
			>
				<IconPlus className="size-3" />
				Adicionar
			</Button>
		);
	}

	return (
		<div className="flex items-center gap-1">
			<Input
				ref={inputRef}
				autoFocus
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				placeholder={
					optionName === "Size" || optionName === "Tamanho"
						? "Ex: XL"
						: optionName === "Color" || optionName === "Cor"
							? "Ex: Vermelho"
							: "Valor"
				}
				className="h-6 w-20 px-2 text-xs"
			/>
		</div>
	);
}
