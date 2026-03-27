'use client';

import { NuevoCliente } from "@/types/cliente";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { EnumTipoCliente, EnumTipoDescuento } from "@prisma/client";
import { NuevaOfertaSchema, NuevoClienteSchema } from "@/repositories/zodSchemas";
import * as z from "zod";
import { NuevaOferta } from "@/types/oferta";
import SelectProducto from "../../shared/SelectProducto";
import { Producto } from "@/types/producto";
import { DatePicker } from "../../../components/ui/datepicker";

interface NuevaOfertaModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (oferta: NuevaOferta) => Promise<void>;
}

export function NuevaOfertaModal({ open, onOpenChange, onSave }: NuevaOfertaModalProps) {
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectProduct = (producto: Producto | null) => {
        setSelectedProducto(producto);
        setFormData({
            ...formData,
            producto_id: producto ? producto.id : -1
        });
        setSearchValue('');
        setErrors({});
    };
    const [formData, setFormData] = useState<NuevaOferta>({
        producto_id: -1,
        tipo: 'porcentaje',
        valor: 0,
        fecha_inicio: new Date(),
        fecha_fin: new Date(new Date().setDate(new Date().getDate() + 1))
    });


    

    const validarOferta = (data: NuevaOferta) => {
        const result = NuevaOfertaSchema.safeParse(data);
        const validationErrors: Record<string, string> = {};

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            Object.entries(fieldErrors).forEach(([key, messages]) => {
                if (messages && messages.length > 0) {
                    validationErrors[key] = messages[0];
                }
            });
        }

        return validationErrors;
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const validationErrors = validarOferta(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        try {
            await onSave(formData);
            setFormData({
                producto_id: -1,
                tipo: 'porcentaje',
                valor: 0,
                fecha_inicio: new Date(),
                fecha_fin: new Date()
            });
            onOpenChange(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                producto_id: -1,
                tipo: 'porcentaje',
                valor: 0,
                fecha_inicio: new Date(),
                fecha_fin: new Date()
            });
            setErrors({});
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-neutral-900">Nueva Oferta</DialogTitle>
                </DialogHeader>

                <div className="grid gap-2 py-2">
                    <div className="grid gap-2">
                        <SelectProducto selectedProducto={selectedProducto} handleSelectProduct={handleSelectProduct} searchValue={searchValue} setSearchValue={setSearchValue} />
                        {errors.producto_id && <p className="text-red-500 text-sm">{errors.producto_id}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tipo">Tipo de descuento</Label>
                        <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value as EnumTipoDescuento })}>
                            <SelectTrigger id="tipo" className="border-neutral-300">
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="porcentaje">Porcentaje</SelectItem>
                                <SelectItem value="monto">Monto</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="valor">Valor de la oferta</Label>
                        <Input
                            id="valor"
                            placeholder="25"
                            value={formData.valor || ''}
                            onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                            className="border-neutral-300"
                            disabled={isLoading}
                            type="number"
                            min={0}
                            step={0.1}
                        />
                        {errors.valor && <p className="text-red-500 text-sm">{errors.valor}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
                        <DatePicker
                            fecha={typeof formData.fecha_inicio === 'string' ? formData.fecha_inicio : formData.fecha_inicio.toISOString().split('T')[0]}
                            onChange={(date) => setFormData({ ...formData, fecha_inicio: date || '' })}
                        />
                        {errors.fecha_inicio && <p className="text-red-500 text-sm">{errors.fecha_inicio}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="fecha_fin">Fecha de vencimiento</Label>
                        <DatePicker
                            fecha={typeof formData.fecha_fin === 'string' ? formData.fecha_fin : formData.fecha_fin.toISOString().split('T')[0]}
                            onChange={(date) => setFormData({ ...formData, fecha_fin: date || '' })}
                        />
                        {errors.fecha_fin && <p className="text-red-500 text-sm">{errors.fecha_fin}</p>}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isLoading} className="border-neutral-300">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
