'use client';

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";

interface CancelarPedidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  pedidoId: number;
  isLoading?: boolean;
}

export function CancelarPedidoModal({
  open,
  onOpenChange,
  onConfirm,
  pedidoId,
  isLoading
}: CancelarPedidoModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">Cancelar Pedido</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-neutral-700">
            ¿Estás seguro de que deseas <strong>cancelar el pedido #{pedidoId}</strong>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-red-700">Advertencia:</p>
            <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
              <li>No podrás revertir esta acción</li>
              <li>El pedido pasará a estado "Cancelado"</li>
              <li>Todos los productos asociados se marcará como no disponibles en este pedido</li>
            </ul>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <span className="text-sm text-neutral-700">
              Sí, deseo cancelar este pedido
            </span>
          </label>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setIsConfirmed(false);
            }}
            className="border-neutral-300"
            disabled={isLoading}
          >
            No, volver atrás
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !isConfirmed}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Cancelando...' : 'Sí, Cancelar Pedido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
