import { AgregarProducto } from "@/types/producto";

interface SeleccionarProductosProps {
    productosSeleccionados?: AgregarProducto[];
    agregarProducto?: (id: number, cantidad: number) => void;
}

export function SeleccionarProductos({ productosSeleccionados, agregarProducto } : SeleccionarProductosProps) {
    return(
        <div>SeleccionarProductos</div>
    );
}