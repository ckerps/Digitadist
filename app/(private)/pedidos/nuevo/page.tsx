'use client';

import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { NuevoPedido } from "@/types/pedido";
import { Card, CardFooter } from "../../../components/ui/card";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../../../components/ui/combobox";
import { useClientes } from "../../clientes/hooks/useClientes";
import { Cliente } from "@/types/cliente";
import { DatePicker } from "../../../components/ui/datepicker";
import { SeleccionarProductos } from "../components";

export default function NuevoPedidoPage() {
    const [searchValue, setSearchValue] = useState('');
    const { clientes } = useClientes({}); // Obtener todos los clientes para el combobox

    const handleCreatePedido = async () => {
        // Implementar la lógica para crear un nuevo pedido
    }

    const [formData, setFormData] = useState<Partial<NuevoPedido>>({
        direccionEntrega: '',
        fechaEstimada: '',
        total: 0,
        clienteId: undefined,
        productos: []
    });

    const filteredClientes = useMemo(() => {
        if (!searchValue || searchValue.length === 0) return clientes?.clientes || [];
        return clientes?.clientes?.filter(c => 
            c?.nombre?.toLowerCase().includes(searchValue.toLowerCase()) || 
            c?.apellido?.toLowerCase().includes(searchValue.toLowerCase())
        ) || [];
    }, [clientes?.clientes, searchValue]);

    const handleAgregarProducto = (id: number, cantidad: number) => {
        setFormData({...formData, productos: [...(formData.productos || []), {id, cantidad}]});
    };

    return (
        <div className="h-full w-full">
            <div className="mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Nuevo Pedido</h1>
            </div>
            <Card>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="clienteLabel">Cliente</Label>
                        <Combobox items={filteredClientes} value={searchValue} onValueChange={(value) => setSearchValue(value??'')} >
                            <ComboboxInput placeholder="Seleccionar cliente" />
                            <ComboboxContent>
                                <ComboboxEmpty>Cliente no encontrado.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item: Cliente) => (
                                        <ComboboxItem key={item?.id} value={item} onSelect={() => {
                                            setFormData({...formData, clienteId: item?.id});
                                        }}>
                                            {item?.nombre} {item?.apellido}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="direccionEntrega">Dirección de entrega</Label>
                        <Input
                            id="direccionEntrega"
                            value={formData.direccionEntrega}
                            onChange={(e) => setFormData({ ...formData, direccionEntrega: e.target.value })}
                            className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fechaEstimada">Fecha Estimada</Label>
                        <DatePicker
                            fecha={formData.fechaEstimada}
                            onChange={(date) => setFormData({ ...formData, fechaEstimada: date || '' })}
                        />
                    </div>
                    <div>
                        <SeleccionarProductos productosSeleccionados={formData.productos} agregarProducto={handleAgregarProducto} />
                    </div>
   
                    <div className="grid gap-2">
                        <Label htmlFor="direccion">Total Autocalculado</Label>
                        <Input
                            id="direccion"
                            value={formData.total}
                            readOnly
                            className="border-neutral-300 focus:border-red-500 focus:ring-red-500 bg-secondary"
                        />
                    </div>
                </div>
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
