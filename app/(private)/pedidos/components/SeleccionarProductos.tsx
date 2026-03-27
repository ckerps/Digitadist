import { AgregarProducto, Producto } from "@/types/producto";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../../../components/ui/combobox";
import { Cliente } from "@/types/cliente";
import { useProductos } from "../../productos/hooks/useProductos";
import { useState } from "react";

interface SeleccionarProductosProps {
    productosSeleccionados?: AgregarProducto[];
    agregarProducto: (id: number, codigo: string, nombre: string, costo: number, recargo: number) => void;
}

export function SeleccionarProductos({ productosSeleccionados, agregarProducto }: SeleccionarProductosProps) {
    const [searchValue, setSearchValue] = useState('');
    const { productos } = useProductos({ itemsPerPage: 10, currentPage: 1, filters: { activo: true, nombre: searchValue.length > 0 ? searchValue : undefined } });

    const filteredProductos = productos?.productos || [];
    const handleAgregarProducto = (id: number, codigo: string, nombre: string, costo: number, recargo: number) => {
        const yaAgregado = productosSeleccionados?.some(p => p.codigo === codigo);
        if (yaAgregado) {
            return;
        }
        agregarProducto(id, codigo, nombre, costo, recargo);
    };

    return (
        <div>

            <Combobox items={filteredProductos} value={searchValue} onValueChange={(value) => setSearchValue(value ?? '')} >
                <ComboboxInput placeholder="Escribi un nombre" className="h-10 w-full"/>
                <ComboboxContent>
                    <ComboboxEmpty>Producto no encontrado.</ComboboxEmpty>
                    <ComboboxList>
                        {(item: Producto) => (
                            <ComboboxItem key={item?.id} onClick={() => {
                                handleAgregarProducto(item?.id, item?.codigo, item?.nombre, item?.costo, item?.porcentaje_recargo);
                                setSearchValue('');
                            }}>
                                {item?.nombre} - {item?.codigo} - Stock: {item?.stock_actual} - ${+item?.costo + +item?.porcentaje_recargo}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}