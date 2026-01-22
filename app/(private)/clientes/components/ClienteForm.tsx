'use client';

import { Cliente, NuevoCliente, TipoCliente } from "@/types/cliente";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";



interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (cliente: NuevoCliente) => void;
  cliente?: Cliente;
}

export function ClienteForm({ open, onOpenChange, onSave, cliente }: ClienteFormProps) {
  const [formData, setFormData] = useState<NuevoCliente>({
    nombre: cliente?.nombre || '',
    apellido: cliente?.apellido || '',
    telefono: cliente?.telefono || '',
    cuit: cliente?.cuit || '',
    direccion: cliente?.direccion || '',
    tipo: cliente?.tipo || 'razon_social',
  });

  const handleSubmit = () => {
    onSave(formData);
    setFormData({
      nombre: '',
      apellido: '',
      telefono: '',
      cuit: '',
      direccion: '',
      tipo: 'razon_social',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">Nuevo Cliente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cuit">CUIT</Label>
            <Input
              id="cuit"
              value={formData.cuit}
              onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
            />
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
          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: string) => setFormData({ ...formData, tipo: value as TipoCliente })}
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
            className="bg-red-600 hover:bg-red-700"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
