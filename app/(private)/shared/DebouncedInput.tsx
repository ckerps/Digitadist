import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function DebouncedInput({
    value,
    onChange,
    placeholder
}: Props) {
    const [searchTerm, setSearchTerm] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== value) {
                onChange(searchTerm);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, onChange]);

    // Sincronizar cuando el valor externo cambia
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    return (
        <Input
            placeholder={placeholder || "Buscar..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-neutral-300 focus:border-red-500 focus:ring-red-500"
        />
    );
}