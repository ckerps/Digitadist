'use client';

import { Producto } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DesactivarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  producto: Producto;
  isDeleting?: boolean;
}

export function DesactivarProductoModal({
  isOpen,
  onClose,
  onConfirm,
  producto,
  isDeleting = false,
}: DesactivarProductoModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al desactivar producto:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-red-600">Desactivar Producto</DialogTitle>
              <DialogDescription className="mt-2 text-neutral-600">
                ¿Está seguro que desea desactivar el producto "{producto.nombre}"?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-lg bg-red-50 p-4 text-sm border border-red-200">
          <p className="text-red-700">
            <strong>Advertencia:</strong> Al desactivar este producto no se podrá usar en nuevos pedidos.
            Los pedidos existentes no se verán afectados.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-neutral-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Desactivando...' : 'Desactivar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
