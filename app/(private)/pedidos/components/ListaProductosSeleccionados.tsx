import { NuevoPedido, AgregarProducto } from "@/types/pedido";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { Input } from "../../../components/ui/input";

export function ListaProductosSeleccionados({ productos, setFormData }: { productos: AgregarProducto[]; setFormData: Dispatch<SetStateAction<Partial<NuevoPedido>>> }) {
    const suma = useMemo(() => {
        return productos.reduce((acc, producto) => {
            return acc + ((+producto.costo + +producto.recargo) * producto.cantidad);
        }, 0);
    }, [productos]);

    const actualizarCantidadProducto = useCallback((codigo: string, nuevaCantidad: string) => {
        const value = parseInt(nuevaCantidad, 10);
        if (isNaN(value) || value < 0) {
            return;
        }
        setFormData((prev) => {
            const index = prev?.productos?.findIndex(p => p.codigo === codigo);
            if(index === undefined) return prev;
            if (index !== -1 && prev?.productos?.[index]?.cantidad === value) {
                return prev;
            }

            const nuevosProductos = prev?.productos ? [...prev?.productos] : [];
            nuevosProductos[index] = { ...nuevosProductos[index], cantidad: value };

            return { ...prev, productos: nuevosProductos };
        });
    }, []);

    return (
        <div>
            <Table className="border">
                <TableCaption>Lista de productos seleccionados.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="p-2">Producto</TableHead>
                        <TableHead className="p-2">Codigo</TableHead>
                        <TableHead className="p-2 md:w-25">Cantidad</TableHead>
                        <TableHead className="p-2 text-right">Precio Unidad</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productos.map((producto) => (
                        <TableRow key={producto?.id} >
                            <TableCell className="p-2 font-medium">{producto?.nombre}</TableCell>
                            <TableCell className="p-2">{producto?.codigo}</TableCell>
                            <TableCell className="p-2">
                                <Input
                                    type="number"
                                    value={producto?.cantidad}
                                    onChange={(e) => actualizarCantidadProducto(producto.codigo, e.target.value)}
                                    className="md:w-20"
                                    key={producto?.id}
                                />
                            </TableCell>
                            <TableCell className="p-2 text-right">${+producto?.costo + +producto?.recargo}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$ {suma}</TableCell>
                    </TableRow>
                </TableFooter>

            </Table>
        </div>
    )
}