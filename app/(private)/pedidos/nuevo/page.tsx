'use client';

import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { NuevoPedido } from "@/types/pedido";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../../../components/ui/combobox";
import { useClientes } from "../../clientes/hooks/useClientes";
import { Cliente } from "@/types/cliente";
import { DatePicker } from "../../../components/ui/datepicker";
import { SeleccionarProductos } from "../components";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ListaProductosSeleccionados } from "../components/ListaProductosSeleccionados";
import { toast } from "sonner";
import { EnumCondicionVenta, EnumEstadoPago, EnumEstadoPedido } from "@prisma/client";

export default function NuevoPedidoPage() {
    const [searchValue, setSearchValue] = useState('');
    const { clientes } = useClientes({});
    const router = useRouter();

    const handleCreatePedido = async () => {
        
        toast.success("El pedido fue creado correctamente");
    }

    const [formData, setFormData] = useState<NuevoPedido>({
        direccion_entrega: '',
        fecha_entrega_estimada: new Date(),
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
        console.log(searchValue);
        return clientes?.clientes?.filter(c =>
            c?.nombre?.toLowerCase().includes(searchValue?.toLowerCase())
        ) || [];
    }, [clientes?.clientes, searchValue]);

    const handleAgregarProducto = (id: number, codigo: string, nombre: string, costo: number, recargo: number) => {
        setFormData({ ...formData, productos: [...(formData.productos || []), { id, codigo, nombre, cantidad: 0, costo, recargo }] });
    };

    return (
        <div className="min-h-screen overflow-hidden w-full">
            <div className="mb-2">
                <div className="flex items-start justify-end">
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/pedidos')}
                            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Pedidos
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Nuevo Pedido</h1>
            </div>
            <Card>
                <CardContent>
                    <div className="grid gap-4 py-4">
                        <div className="md:grid-cols-2 gap-2">
                            <div className="gap-2">
                                <Label htmlFor="clienteLabel">Cliente</Label>
                                <Combobox items={filteredClientes} value={searchValue} onValueChange={(value) => setSearchValue(value ?? '')}>
                                    <ComboboxInput placeholder="Seleccionar cliente" className=" h-10 w-full" value={searchValue}/>
                                    <ComboboxContent>
                                        <ComboboxEmpty>Cliente no encontrado.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item: Cliente) => (
                                                <ComboboxItem key={item?.id} value={item?.nombre || ''} onSelect={() => {
                                                    setFormData({ ...formData, cliente_id: item?.id });
                                                    setSearchValue(item?.nombre || '');
                                                }}>
                                                    {item?.nombre}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                            <div className="gap-2">
                                <Label htmlFor="direccionEntrega">Dirección de entrega</Label>
                                <Input
                                    id="direccionEntrega"
                                    value={formData.direccion_entrega}
                                    placeholder="Ingrese la dirección de entrega"
                                    onChange={(e) => setFormData({ ...formData, direccion_entrega: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="md:grid-cols-2 gap-2">
                            <div className="gap-2">
                                <Label htmlFor="fechaEstimada">Fecha Estimada</Label>
                                <DatePicker
                                    fecha={formData.fecha_entrega_estimada.toISOString().split('T')[0]}
                                    onChange={(date) => setFormData({ ...formData, fecha_entrega_estimada: new Date(date!)})}
                                />
                            </div>
                            <div className="gap-2">
                                <Label htmlFor="condicionVenta">Condicion de venta</Label>
                                <Select value={formData.condicion_venta} onValueChange={(value)=>setFormData({...formData, condicion_venta: value as EnumCondicionVenta})}>
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
                            <ListaProductosSeleccionados productos={formData.productos || []} setFormData={setFormData} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button
                        onClick={handleCreatePedido}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Guardar
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
