import { NuevoPedido } from "@/types/pedido";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { AgregarProducto } from "@/types/producto";
import { Button } from "@/components/ui/button";
import { Tag, Trash2, X, Minus, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ListaProductosSeleccionados({ 
    productos, 
    setFormData, 
    quitarProducto 
}: { 
    productos: AgregarProducto[]; 
    setFormData: Dispatch<SetStateAction<NuevoPedido>>; 
    quitarProducto?: (id: number) => void 
}) {
    const calcularPrecioUnidadConOferta = (producto: AgregarProducto) => {
        const precioBase = producto.costo + (producto.costo * producto.recargo / 100);
        if (producto.oferta && producto.usar_oferta !== false) {
            if (producto.oferta.tipo === 'porcentaje') {
                return precioBase * (1 - producto.oferta.valor / 100);
            }
            return Math.max(0, precioBase - producto.oferta.valor);
        }
        return precioBase;
    };

    const suma = useMemo(() => {
        return productos.reduce((acc, producto) => {
            const precioUnidad = calcularPrecioUnidadConOferta(producto);
            return acc + (precioUnidad * producto.cantidad);
        }, 0);
    }, [productos]);

    const actualizarCantidadProducto = useCallback((codigo: string, nuevaCantidad: string) => {
        const value = parseInt(nuevaCantidad, 10);
        if (isNaN(value) || value < 0) {
            return;
        }
        setFormData((prev) => {
            const index = prev?.productos?.findIndex(p => p.codigo === codigo);
            if (index === undefined || index === -1) return prev;
            
            const nuevosProductos = [...(prev.productos || [])];
            nuevosProductos[index] = { ...nuevosProductos[index], cantidad: value };

            return { ...prev, productos: nuevosProductos };
        });
    }, [setFormData]);

    const toggleOferta = useCallback((id: number) => {
        setFormData((prev) => {
            const index = prev?.productos?.findIndex(p => p.id === id);
            if (index === undefined || index === -1) return prev;

            const nuevosProductos = [...(prev.productos || [])];
            const p = nuevosProductos[index];
            nuevosProductos[index] = { 
                ...p, 
                usar_oferta: p.usar_oferta === false ? true : false 
            };

            return { ...prev, productos: nuevosProductos };
        });
    }, [setFormData]);

    return (
        <div className="w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block w-full overflow-x-auto rounded-md border border-neutral-200">
            <Table className="w-full min-w-[600px] border-collapse bg-white">
                <TableHeader className="bg-neutral-50 font-bold">
                    <TableRow>
                        <TableHead className="w-[30%] px-4 py-3">Producto</TableHead>
                        <TableHead className="w-[15%] px-4 py-3 text-center">Código</TableHead>
                        <TableHead className="w-[15%] px-4 py-3 text-center">Cantidad</TableHead>
                        <TableHead className="w-[20%] px-4 py-3 text-center">P. Unidad</TableHead>
                        <TableHead className="w-[20%] px-4 py-3 text-center">Subtotal</TableHead>
                        {quitarProducto && <TableHead className="w-[10%] px-4 py-3 text-center">Acción</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={quitarProducto ? 6 : 5} className="h-24 text-center text-neutral-500">
                                No hay productos seleccionados
                            </TableCell>
                        </TableRow>
                    ) : (
                        productos.map((producto) => {
                            const precioBase = producto.costo + (producto.costo * producto.recargo / 100);
                            const precioFinal = calcularPrecioUnidadConOferta(producto);
                            const tieneOferta = !!producto.oferta;
                            const ofertaAplicada = tieneOferta && producto.usar_oferta !== false;
                            const stockExcedido = producto.stock_actual !== undefined && producto.cantidad > producto.stock_actual;

                            return (
                                <TableRow key={producto?.id} className="hover:bg-neutral-50 transition-colors">
                                    <TableCell className="px-4 py-3 font-medium">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-neutral-900">{producto?.nombre}</span>
                                            {tieneOferta && (
                                                <button
                                                    onClick={() => toggleOferta(producto.id)}
                                                    className={cn(
                                                        "flex items-center gap-1 w-fit text-[10px] px-1.5 py-0.5 rounded font-bold uppercase transition-all",
                                                        ofertaAplicada 
                                                            ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200" 
                                                            : "bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200"
                                                    )}
                                                    title={ofertaAplicada ? "Quitar oferta" : "Aplicar oferta"}
                                                >
                                                    <Tag className="h-2.5 w-2.5" />
                                                    {ofertaAplicada ? `Oferta: ${producto.oferta?.tipo === 'porcentaje' ? `${producto.oferta.valor}% OFF` : `$${producto.oferta?.valor} OFF`}` : "Aplicar Oferta"}
                                                    {ofertaAplicada && <X className="h-2.5 w-2.5 ml-1" />}
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center text-neutral-600 text-sm">{producto?.codigo}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <Input
                                                type="number"
                                                min="1"
                                                value={producto?.cantidad || ''}
                                                onChange={(e) => actualizarCantidadProducto(producto.codigo, e.target.value)}
                                                className={cn("w-20 h-9 text-center", stockExcedido && "border-red-500 text-red-600")}
                                            />
                                            {stockExcedido && (
                                                <span className="text-[10px] text-red-500 font-medium">Stock: {producto.stock_actual}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={cn(
                                                "font-semibold",
                                                ofertaAplicada ? "text-red-600" : "text-neutral-900"
                                            )}>
                                                ${precioFinal.toFixed(2)}
                                            </span>
                                            {ofertaAplicada && (
                                                <span className="text-[10px] text-neutral-400 line-through">
                                                    ${precioBase.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center font-bold text-neutral-900">
                                        ${(precioFinal * producto.cantidad).toFixed(2)}
                                    </TableCell>
                                    {quitarProducto && (
                                        <TableCell className="px-4 py-3 text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => quitarProducto(producto.id)}
                                                className="h-8 w-8 p-0 hover:bg-red-50 text-neutral-400 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
                <TableFooter className="bg-neutral-50 border-t-2 border-neutral-200">
                    <TableRow>
                        <TableCell colSpan={quitarProducto ? 4 : 3} className="px-4 py-4 text-right text-sm font-medium text-neutral-600">
                            Total Pedido
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center font-bold text-xl text-neutral-900">
                            ${suma.toFixed(2)}
                        </TableCell>
                        {quitarProducto && <TableCell className="px-4 py-4" />}
                    </TableRow>
                </TableFooter>
            </Table>
        </div>

        {/* Mobile Card View */}
        <div className="flex md:hidden flex-col gap-3 w-full mt-2">
            {productos.length === 0 ? (
                <div className="text-center p-6 bg-neutral-50 text-neutral-500 rounded-md border border-neutral-200">
                    No hay productos seleccionados
                </div>
            ) : (
                productos.map((producto) => {
                    const precioBase = producto.costo + (producto.costo * producto.recargo / 100);
                    const precioFinal = calcularPrecioUnidadConOferta(producto);
                    const tieneOferta = !!producto.oferta;
                    const ofertaAplicada = tieneOferta && producto.usar_oferta !== false;
                    const stockExcedido = producto.stock_actual !== undefined && producto.cantidad > producto.stock_actual;

                    return (
                        <Card key={producto.id} className="border-neutral-200 shadow-xs">
                            <div className="p-3 pb-2">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-neutral-900 leading-tight">{producto.nombre}</span>
                                        <span className="text-[11px] text-neutral-500 mt-0.5">Cod: {producto.codigo}</span>
                                        {tieneOferta && (
                                            <button
                                                onClick={() => toggleOferta(producto.id)}
                                                className={cn(
                                                    "mt-1.5 flex items-center gap-1 w-fit text-[10px] px-1.5 py-0.5 rounded font-bold uppercase transition-all",
                                                    ofertaAplicada 
                                                        ? "bg-red-100 text-red-700 border border-red-200" 
                                                        : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                                                )}
                                            >
                                                <Tag className="h-2.5 w-2.5" />
                                                {ofertaAplicada ? `Oferta: ${producto.oferta?.tipo === 'porcentaje' ? `${producto.oferta.valor}% OFF` : `$${producto.oferta?.valor} OFF`}` : "Aplicar Oferta"}
                                                {ofertaAplicada && <X className="h-2.5 w-2.5 ml-1" />}
                                            </button>
                                        )}
                                    </div>
                                    {quitarProducto && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => quitarProducto(producto.id)}
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between border-t border-neutral-100 mt-2 pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5 font-medium">P. Unitario</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn("text-sm font-bold", ofertaAplicada ? "text-red-600" : "text-neutral-900")}>
                                                ${precioFinal.toFixed(2)}
                                            </span>
                                            {ofertaAplicada && (
                                                <span className="text-[10px] text-neutral-400 line-through">
                                                    ${precioBase.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="h-8 w-8 text-neutral-600 bg-neutral-50 rounded-md"
                                            onClick={() => actualizarCantidadProducto(producto.codigo, String(Math.max(1, producto.cantidad - 1)))}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={producto?.cantidad || ''}
                                            onChange={(e) => actualizarCantidadProducto(producto.codigo, e.target.value)}
                                            className={cn("w-12 h-8 text-center text-sm font-semibold p-1", stockExcedido && "border-red-500 text-red-600")}
                                        />
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="h-8 w-8 text-neutral-600 bg-neutral-50 rounded-md"
                                            onClick={() => actualizarCantidadProducto(producto.codigo, String(producto.cantidad + 1))}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-neutral-50 p-2.5 rounded-b-md border-t border-neutral-200 flex justify-between items-center px-3">
                                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Subtotal:</span>
                                <span className="font-bold text-neutral-900">${(precioFinal * producto.cantidad).toFixed(2)}</span>
                            </div>
                        </Card>
                    )
                })
            )}
            <div className="mt-1 p-3.5 bg-neutral-900 text-white rounded-lg flex justify-between items-center shadow-md">
                <span className="font-medium text-sm">Total Pedido</span>
                <span className="font-bold text-lg">${suma.toFixed(2)}</span>
            </div>
        </div>

        </div>
    );
}
