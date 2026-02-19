'use client';

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { EnumEstadoPedido } from "@prisma/client";

interface CambiarEstadoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (nuevoEstado: EnumEstadoPedido) => Promise<void>;
  estadoActual: EnumEstadoPedido;
  isLoading?: boolean;
}

const estadoOptions = [
  { value: 'registrado', label: 'Registrado' },
  { value: 'en_preparacion', label: 'En Preparación' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' },
];

export function CambiarEstadoModal({
  open,
  onOpenChange,
  onConfirm,
  estadoActual,
  isLoading
}: CambiarEstadoModalProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EnumEstadoPedido>(estadoActual);

  const handleConfirm = async () => {
    if (nuevoEstado === estadoActual) {
      onOpenChange(false);
      return;
    }
    await onConfirm(nuevoEstado);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">Cambiar Estado del Pedido</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="estado" className="text-neutral-700 font-medium">
              Nuevo Estado
            </Label>
            <Select value={nuevoEstado} onValueChange={(value) => setNuevoEstado(value as EnumEstadoPedido)}>
              <SelectTrigger className="w-full border-neutral-300">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {estadoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {nuevoEstado === 'cancelado' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                <strong>·Aviso:</strong> Al cancelar el pedido, ya no podrá volver a activarlo.
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-neutral-300"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || nuevoEstado === estadoActual}
            className={nuevoEstado === 'cancelado' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {isLoading ? 'Actualizando...' : 'Cambiar Estado'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
