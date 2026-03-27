import { NuevoPedido } from "@/types/pedido";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { AgregarProducto } from "@/types/producto";
import { Button } from "@/components/ui/button";
import { Cross, RemoveFormatting, Trash, X } from "lucide-react";

export function ListaProductosSeleccionados({ productos, setFormData, quitarProducto }: { productos: AgregarProducto[]; setFormData: Dispatch<SetStateAction<NuevoPedido>>; quitarProducto?: (id: number) => void }) {
    const suma = useMemo(() => {
        return productos.reduce((acc, producto) => {
            return acc + ((+producto.costo + (producto.costo * producto.recargo / 100)) * producto.cantidad);
        }, 0);
    }, [productos]);

    const actualizarCantidadProducto = useCallback((codigo: string, nuevaCantidad: string) => {
        const value = parseInt(nuevaCantidad, 10);
        if (isNaN(value) || value < 0) {
            return;
        }
        setFormData((prev) => {
            const index = prev?.productos?.findIndex(p => p.codigo === codigo);
            if (index === undefined) return prev;
            if (index !== -1 && prev?.productos?.[index]?.cantidad === value) {
                return prev;
            }

            const nuevosProductos = prev?.productos ? [...prev?.productos] : [];
            nuevosProductos[index] = { ...nuevosProductos[index], cantidad: value };

            return { ...prev, productos: nuevosProductos };
        });
    }, []);

    const columnWidth = quitarProducto ? "w-[20%]" : "w-[25%]";

    return (
        <Table className="w-full border table-fixed">
            <TableHeader>
                <TableRow>
                    <TableHead className={`${columnWidth} px-2`}>Producto</TableHead>
                    <TableHead className={`${columnWidth} px-2`}>Codigo</TableHead>
                    <TableHead className={`${columnWidth} px-2 text-center`}>Cantidad</TableHead>
                    <TableHead className={`${columnWidth} px-2 text-center`}>Precio Unidad</TableHead>
                    {quitarProducto && <TableHead className={`${columnWidth} px-2 text-center`}>Acción</TableHead>}
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
                                className="w-full"
                                key={producto?.id}
                            />
                        </TableCell>
                        <TableCell className="p-2 text-center">${(+producto?.costo + (producto?.costo * producto?.recargo / 100)).toFixed(2)}</TableCell>
                        {quitarProducto && <TableCell className="p-2 flex items-center justify-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => quitarProducto(producto.id)}
                            >
                                <X className="h-4 w-4 text-red-600" />
                            </Button>
                        </TableCell>}
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={quitarProducto ? 4 : 3} className="text-right">Total</TableCell>
                    <TableCell className="text-right font-bold">$ {suma.toFixed(2)}</TableCell>
                </TableRow>
            </TableFooter>

        </Table>
    )
}
