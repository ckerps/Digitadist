'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditarCantidadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (cantidad: number, subtotal: number, descuento?: number) => Promise<void>;
  cantidadActual: number;
  precioUnitario: number;
  descuentoActual?: number;
  isLoading?: boolean;
}

export function EditarCantidadModal({
  open,
  onOpenChange,
  onConfirm,
  cantidadActual,
  precioUnitario,
  descuentoActual = 0,
  isLoading
}: EditarCantidadModalProps) {
  const [cantidad, setCantidad] = useState<number>(cantidadActual);
  const [descuento, setDescuento] = useState<number>(descuentoActual);
  const [error, setError] = useState<string>('');

  const subtotal = (precioUnitario * cantidad) - descuento;

  const handleConfirm = async () => {
    setError('');

    if (!cantidad || cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (subtotal <= 0) {
      setError('El subtotal no puede ser menor o igual a 0');
      return;
    }

    try {
      await onConfirm(cantidad, subtotal, descuento);
      onOpenChange(false);
    } catch (err) {
      setError('Error al actualizar la cantidad. Intenta de nuevo.');
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">Editar Cantidad</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cantidad" className="text-neutral-700 font-medium">
              Cantidad
            </Label>
            <Input
              id="cantidad"
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
              className="border-neutral-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descuento" className="text-neutral-700 font-medium">
              Descuento ($)
            </Label>
            <Input
              id="descuento"
              type="number"
              min="0"
              value={descuento}
              onChange={(e) => setDescuento(parseFloat(e.target.value) ?? undefined)}
              className="border-neutral-300"
            />
          </div>
          <div className="bg-neutral-100 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Precio Unitario</p>
                <p className="font-semibold text-neutral-900">${formatCurrency(precioUnitario)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Subtotal</p>
                <p className="font-semibold text-neutral-900">${formatCurrency(subtotal)}</p>
              </div>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
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
            disabled={isLoading || cantidad === cantidadActual && descuento === descuentoActual}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
