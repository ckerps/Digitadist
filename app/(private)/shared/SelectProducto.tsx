import { Producto } from "@/types/producto";
import { Label } from "../../components/ui/label";
import { useProductos } from "../productos/hooks/useProductos";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";

interface SelectProps {
    selectedProducto: Producto | null;
    handleSelectProduct: (producto: Producto | null) => void;
    searchValue: string;
    setSearchValue: (value: string) => void;
}

export default function SelectProducto({ selectedProducto, handleSelectProduct, searchValue, setSearchValue }: SelectProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    const { productos, isLoadingList } = useProductos({
        itemsPerPage: 30,
        currentPage: 1,
        filters: {
            activo: true,
            nombre: searchValue.length > 0 ? searchValue : undefined
        }
    });
    

    const filteredProductos = productos?.productos || [];

    return (
        <div className="space-y-2" >
            <Label className="text-neutral-700 font-medium">Producto</Label>
            {
                selectedProducto ? (
                    <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-3">
                        <p className="font-medium text-neutral-900">{selectedProducto.nombre}</p>
                        <p className="text-sm text-neutral-600">Código: {selectedProducto.codigo}</p>
                        <p className="text-sm text-neutral-600">Stock: {selectedProducto.stock_actual}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectProduct(null)}
                            className="mt-2 border-neutral-300"
                        >
                            Cambiar producto
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2 relative">
                        <Input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchValue}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchValue(value);
                                setShowDropdown(value.length > 0);
                            }}
                            onFocus={() => {
                                if (searchValue.length > 0) {
                                    setShowDropdown(true);
                                }
                            }}
                            onBlur={() => {
                                setTimeout(() => setShowDropdown(false), 200);
                            }}
                            className="border-neutral-300"
                        />
                        {showDropdown && searchValue.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 border border-neutral-300 rounded-lg max-h-48 overflow-y-auto shadow-lg bg-white z-50">
                                {isLoadingList ? (
                                    <div className="p-3 text-center text-neutral-600 text-sm">
                                        Cargando productos...
                                    </div>
                                ) : filteredProductos.length > 0 ? (
                                    filteredProductos.map((producto) => (
                                        <button
                                            key={producto.id}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSelectProduct(producto as any);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-neutral-100 active:bg-neutral-100 transition-colors border-b border-neutral-200 last:border-b-0 flex items-start justify-between gap-2"
                                        >
                                            <div>
                                                <p className="font-medium text-neutral-900">{producto.nombre}</p>
                                                <p className="text-xs text-neutral-600">Código: {producto.codigo} | Stock: {producto.stock_actual}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-3 text-center text-neutral-600 text-sm">
                                        Producto no encontrado
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    )

}