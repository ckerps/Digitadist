'use client';

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { NuevoDetallePedido, NuevoPedido } from "@/types/pedido";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { useClientes } from "../../clientes/hooks/useClientes";
import { Cliente } from "@/types/cliente";
import { DatePicker } from "@/components/ui/datepicker";
import { DetallePedidoTable, SeleccionarProductos } from "../components";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ListaProductosSeleccionados } from "../components/ListaProductosSeleccionados";
import { toast } from "sonner";
import { EnumCondicionVenta, EnumEstadoPago, EnumEstadoPedido, Oferta } from "@prisma/client";
import { usePedidosComplete } from "../hooks/usePedidosComplete";
import { useSession } from "next-auth/react";

export default function NuevoPedidoPage() {
    const { data: session } = useSession();
    const [searchValue, setSearchValue] = useState('');
    const { clientes } = useClientes({});
    const router = useRouter();
    const { createPedido } = usePedidosComplete();

    const handleCreatePedido = async () => {
        if (!formData.cliente_id) {
            toast.error("Debe seleccionar un cliente");
            return;
        }
        if (!session?.user?.id) {
            toast.error("Debe iniciar sesión para realizar esta acción");
            return;
        }
        if (!formData.direccion_entrega) {
            toast.error("Debe ingresar una dirección de entrega");
            return;
        }
        if (!formData.fecha_entrega_estimada) {
            toast.error("Debe ingresar una fecha de entrega estimada");
            return;
        }
        if (!formData.condicion_venta) {
            toast.error("Debe seleccionar una condición de venta");
            return;
        }
        if (!formData.productos || formData.productos.length === 0) {
            toast.error("Debe seleccionar al menos un producto");
            return;
        }

        try {
            const { productos, ...pedido } = formData;
            pedido.vendedor_id = Number(session.user.id);
            const detalle: NuevoDetallePedido[] = productos.map(p => {
                const precioBase = p.costo + (p.costo * p.recargo / 100);
                let precioFinal = precioBase;
                let descuentoMonto = 0;

                if (p.oferta && p.usar_oferta !== false) {
                    if (p.oferta.tipo === 'porcentaje') {
                        descuentoMonto = precioBase * (p.oferta.valor / 100);
                        precioFinal = precioBase - descuentoMonto;
                    } else {
                        descuentoMonto = p.oferta.valor;
                        precioFinal = Math.max(0, precioBase - descuentoMonto);
                    }
                }

                return {
                    producto_id: p.id,
                    cantidad: p.cantidad,
                    precio_unitario: precioFinal,
                    descuento: descuentoMonto,
                    subtotal: precioFinal * p.cantidad
                };
            });

            pedido.costo = detalle.reduce((acc, item) => acc + (productos.find(p => p.id === item.producto_id)?.costo || 0) * item.cantidad, 0);
            pedido.total = detalle.reduce((acc, item) => acc + item.subtotal, 0);
            pedido.descuento = detalle.reduce((acc, item) => acc + (item.descuento || 0) * item.cantidad, 0);
            await createPedido(pedido, detalle);
            toast.success("El pedido fue creado correctamente");
            router.push('/pedidos');
        } catch (error) {
            toast.error("Error al crear el pedido");
        }
    }

    const [formData, setFormData] = useState<NuevoPedido>({
        direccion_entrega: '',
        fecha_entrega_estimada: new Date(Date.now() + 7* 24 * 60 * 60 * 1000),
        total: 0,
        cliente_id: undefined,
        vendedor_id: undefined,
        condicion_venta: EnumCondicionVenta.contado,
        productos: [],
        costo: 0,
        estado: EnumEstadoPedido.registrado,
        estado_pago: EnumEstadoPago.en_deuda
    });

    const filteredClientes = useMemo(() => {
        if (!searchValue || searchValue.length === 0) return clientes?.clientes || [];
        return clientes?.clientes?.filter(c =>
            c?.nombre?.toLowerCase().includes(searchValue?.toLowerCase())
        ) || [];
    }, [clientes?.clientes, searchValue]);

    const handleAgregarProducto = (id: number, codigo: string, nombre: string, costo: number, recargo: number, oferta?: Oferta | null) => {
        setFormData({ 
            ...formData, 
            productos: [
                ...(formData.productos || []), 
                { id, codigo, nombre, cantidad: 1, costo, recargo, oferta, usar_oferta: !!oferta }
            ] 
        });
    };

    const handleQuitarProducto = (id: number) => {
        setFormData({ ...formData, productos: formData.productos?.filter(p => p.id !== id) });
    };

    return (
        <div className="h-full w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">Nuevo Pedido</h1>
                    <p className="text-muted-foreground text-sm mt-1">Crea un nuevo pedido</p>
                </div>
                <Button
                    onClick={() => router.push('/pedidos')}
                    size="lg"
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
            </div>
            <Card>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-full gap-2">
                                <Label htmlFor="clienteLabel">Cliente</Label>
                                <Combobox
                                    value={searchValue}
                                    onValueChange={(value) => {
                                        setSearchValue(value ?? '');
                                        const selectedClient = clientes?.clientes?.find(c => c.nombre === value);
                                        if (selectedClient) {
                                            setFormData(prev => ({ ...prev, cliente_id: selectedClient.id }));
                                        }
                                    }}
                                >
                                    <ComboboxInput placeholder="Seleccionar cliente" className=" h-10 w-full" value={searchValue} />
                                    <ComboboxContent>
                                        <ComboboxList>
                                            {filteredClientes?.map((item: Cliente) => (
                                                <ComboboxItem
                                                    key={item?.id}
                                                    value={item?.nombre || ''}
                                                >
                                                    {item?.nombre}
                                                </ComboboxItem>
                                            ))}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                            <div className="w-full gap-2">
                                <Label htmlFor="direccionEntrega">Dirección de entrega</Label>
                                <Input
                                    id="direccionEntrega"
                                    value={formData.direccion_entrega}
                                    placeholder="Ingrese la dirección de entrega"
                                    onChange={(e) => setFormData({ ...formData, direccion_entrega: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <div className="w-full gap-2">
                                <Label htmlFor="fechaEstimada">Fecha Estimada</Label>
                                <DatePicker
                                    fecha={formData.fecha_entrega_estimada.toISOString().split('T')[0]}
                                    onChange={(date) => setFormData({ ...formData, fecha_entrega_estimada: new Date(date!) })}
                                />
                            </div>
                            <div className="w-full gap-2">
                                <Label htmlFor="condicionVenta">Condicion de venta</Label>
                                <Select value={formData.condicion_venta} onValueChange={(value) => setFormData({ ...formData, condicion_venta: value as EnumCondicionVenta })}>
                                    <SelectTrigger className="h-10 w-full">
                                        <SelectValue placeholder="Selecciona una condicion de venta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={EnumCondicionVenta.contado}>{EnumCondicionVenta.contado}</SelectItem>
                                        <SelectItem value={EnumCondicionVenta.transferencia}>{EnumCondicionVenta.transferencia}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="seleccionarProductos">Seleccionar Productos</Label>
                            <SeleccionarProductos productosSeleccionados={formData.productos} agregarProducto={handleAgregarProducto} />
                            <ListaProductosSeleccionados productos={formData.productos || []} setFormData={setFormData} quitarProducto={handleQuitarProducto} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button
                        onClick={handleCreatePedido}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Crear Pedido
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
