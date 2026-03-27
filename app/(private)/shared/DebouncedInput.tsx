import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    icon?: React.ReactNode;
}

export default function DebouncedInput({
    value,
    onChange,
    placeholder,
    className,
    icon
}: Props) {
    const [searchTerm, setSearchTerm] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== value) {
                onChange(searchTerm);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, onChange, value]);

    // Sincronizar cuando el valor externo cambia
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    return (
        <>
            {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">{icon}</div>}
            <Input
                placeholder={placeholder || "Buscar..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("pl-10 border-neutral-300 focus:border-red-500 focus:ring-red-500", className)}
            />
        </>
    );
}
