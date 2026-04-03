import { AgregarProducto, Producto } from "@/types/producto";
import { Oferta } from "@prisma/client";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Cliente } from "@/types/cliente";
import { useProductos } from "../../productos/hooks/useProductos";
import { useState } from "react";

interface SeleccionarProductosProps {
    productosSeleccionados?: AgregarProducto[];
    agregarProducto: (id: number, codigo: string, nombre: string, costo: number, recargo: number, oferta?: Oferta | null) => void;
}

export function SeleccionarProductos({ productosSeleccionados, agregarProducto }: SeleccionarProductosProps) {
    const [searchValue, setSearchValue] = useState('');
    const { productos } = useProductos({ itemsPerPage: 50, currentPage: 1, filters: { activo: true, nombre: searchValue.length > 0 ? searchValue : undefined } });

    const filteredProductos = productos?.productos || [];
    const handleAgregarProducto = (id: number, codigo: string, nombre: string, costo: number, recargo: number, ofertas?: Oferta[]) => {
        const yaAgregado = productosSeleccionados?.some(p => p.codigo === codigo);
        if (yaAgregado) {
            return;
        }
        
        // La primera oferta activa que encontremos (el repo ya filtró por vigencia)
        const ofertaActiva = ofertas && ofertas.length > 0 ? ofertas[0] : null;
        
        agregarProducto(id, codigo, nombre, costo, recargo, ofertaActiva);
    };

    return (
        <div>

            <Combobox items={filteredProductos} value={searchValue} onValueChange={(value) => setSearchValue(value ?? '')} >
                <ComboboxInput placeholder="Escribi un nombre" className="h-10 w-full" />
                <ComboboxContent>
                    <ComboboxEmpty>Producto no encontrado.</ComboboxEmpty>
                    <ComboboxList>
                        {(item: Producto) => (
                            <ComboboxItem key={item?.id} onClick={() => {
                                handleAgregarProducto(item?.id, item?.codigo, item?.nombre, item?.costo, item?.porcentaje_recargo, item?.ofertas);
                                setSearchValue('');
                            }}>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span>{item?.nombre} - {item?.codigo}</span>
                                        {item?.ofertas && item.ofertas.length > 0 && (
                                            <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Oferta</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Stock: {item?.stock_actual} - ${(+item?.costo + (item?.costo * item?.porcentaje_recargo / 100)).toFixed(2)}
                                    </span>
                                </div>
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}
