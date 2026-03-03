'use client';

import { NuevoCliente } from "@/types/cliente";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { EnumTipoCliente } from "@prisma/client";
import { NuevoClienteSchema } from "@/repositories/zodSchemas";
import * as z from "zod";

interface NuevoClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cliente: NuevoCliente) => Promise<void>;
}

export function NuevoClienteModal({ open, onOpenChange, onSave }: NuevoClienteModalProps) {
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
    
    try {
      await onSave(formData);
      setFormData({
        nombre: '',
        telefono: '',
        cuit: '',
        direccion: '',
        tipo: 'razon_social',
        email: '',
        activo: true
      });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        nombre: '',
        telefono: '',
        cuit: '',
        direccion: '',
        tipo: 'razon_social',
        email: '',
        activo: true
      });
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">Nuevo Cliente</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo de Cliente</Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value as EnumTipoCliente })}>
              <SelectTrigger id="tipo" className="border-neutral-300">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="razon_social">Razón Social</SelectItem>
                <SelectItem value="persona">Persona</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Ingresa el nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cuit">CUIT (opcional)</Label>
            <Input
              id="cuit"
              placeholder="XX-XXXXXXXX-X"
              value={formData.cuit || ''}
              onChange={(e) => setFormData({ ...formData, cuit: e.target.value || undefined })}
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.cuit && <p className="text-red-500 text-sm">{errors.cuit}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              placeholder="+5493432561407"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              placeholder="Calle, número, apartado"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
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
