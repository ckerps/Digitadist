'use client';

import { NuevoCliente, UpdateCliente } from "@/types/cliente";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { Cliente, EnumTipoCliente } from "@prisma/client";
import { NuevoClienteSchema } from "@/repositories/zodSchemas";
import * as z from "zod";



interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (cliente: NuevoCliente) => Promise<void>;
  onUpdate?: (id: number, cliente: UpdateCliente) => Promise<void>;
  cliente?: Cliente;
}

export function ClienteForm({ open, onOpenChange, onSave, cliente, onUpdate }: ClienteFormProps) {
  const isEditing = !!cliente;

  const [formData, setFormData] = useState<NuevoCliente>({
    nombre: '',
    telefono: '',
    cuit: '',
    direccion: '',
    tipo: 'razon_social',
    email: '',
    activo: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cliente && open) {
      setFormData({
        nombre: cliente.nombre,
        telefono: cliente.telefono || '',
        cuit: cliente.cuit || '',
        direccion: cliente.direccion || '',
        tipo: cliente.tipo,
        email: cliente.email || '',
        activo: cliente.activo
      });
    } else if (!open) {
      setFormData({
        nombre: '', telefono: '', cuit: '', direccion: '',
        tipo: 'razon_social', email: '', activo: true
      });
    }
  }, [cliente, open]);

  const validarCliente = (data: NuevoCliente) => {
    const result = NuevoClienteSchema.safeParse(data);
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
    const validationErrors = validarCliente(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
    if (isEditing && cliente && onUpdate) {
      await onUpdate(cliente.id, formData as UpdateCliente);
    } else if (onSave) {
      await onSave(formData as NuevoCliente);
    }
    onOpenChange(false);

  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">Nuevo Cliente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {errors.general && (
            <div className="text-red-600 text-sm">{errors.general}</div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
            {errors.nombre && <div className="text-red-600 text-sm">{errors.nombre}</div>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
            {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
            {errors.telefono && <div className="text-red-600 text-sm">{errors.telefono}</div>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cuit">CUIT</Label>
            <Input
              id="cuit"
              value={formData.cuit}
              onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
            {errors.cuit && <div className="text-red-600 text-sm">{errors.cuit}</div>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          {errors.direccion && <div className="text-red-600 text-sm">{errors.direccion}</div>}

          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: string) => setFormData({ ...formData, tipo: value as EnumTipoCliente })}
            >
              <SelectTrigger className="border-neutral-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="razon_social">Razón Social</SelectItem>
                <SelectItem value="persona">Persona</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.tipo && <div className="text-red-600 text-sm">{errors.tipo}</div>}

        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-neutral-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
