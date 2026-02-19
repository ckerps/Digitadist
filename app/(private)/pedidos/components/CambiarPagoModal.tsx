'use client';

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { EnumEstadoPago } from "@prisma/client";

interface CambiarPagoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (nuevoPago: EnumEstadoPago) => Promise<void>;
  estadoPagoActual: EnumEstadoPago;
  isLoading?: boolean;
}

const pagoOptions = [
  { value: 'pagado', label: 'Pagado' },
  { value: 'en_deuda', label: 'En Deuda' },
];

export function CambiarPagoModal({
  open,
  onOpenChange,
  onConfirm,
  estadoPagoActual,
  isLoading
}: CambiarPagoModalProps) {
  const [nuevoPago, setNuevoPago] = useState<EnumEstadoPago>(estadoPagoActual);

  const handleConfirm = async () => {
    if (nuevoPago === estadoPagoActual) {
      onOpenChange(false);
      return;
    }
    await onConfirm(nuevoPago);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">Cambiar Estado de Pago</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pago" className="text-neutral-700 font-medium">
              Nuevo Estado de Pago
            </Label>
            <Select value={nuevoPago} onValueChange={(value) => setNuevoPago(value as EnumEstadoPago)}>
              <SelectTrigger className="w-full border-neutral-300">
                <SelectValue placeholder="Seleccionar estado de pago" />
              </SelectTrigger>
              <SelectContent>
                {pagoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {nuevoPago === 'en_deuda' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                <strong>Aviso:</strong> El pedido quedará marcado como pendiente de pago.
              </p>
            </div>
          )}
          {nuevoPago === 'pagado' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                <strong>Confirmación:</strong> El pedido pasará a estar pagado.
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
            disabled={isLoading || nuevoPago === estadoPagoActual}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Actualizando...' : 'Cambiar Pago'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
