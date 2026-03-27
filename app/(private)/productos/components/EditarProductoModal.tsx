'use client';

import { Producto, EnumPresentacion } from '@prisma/client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UpdateProducto } from '@/types/producto';

interface EditarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateProducto) => Promise<void>;
  producto: Producto;
  isSaving?: boolean;
}

export function EditarProductoModal({
  isOpen,
  onClose,
  onSave,
  producto,
  isSaving = false,
}: EditarProductoModalProps) {
  const [formData, setFormData] = useState<UpdateProducto>({
    stock_actual: producto.stock_actual,
    costo: producto.costo as any,
    porcentaje_recargo: producto.porcentaje_recargo,
    imagen: producto.imagen || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Modifica los datos del producto {producto.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-sm">
          <div className="grid gap-2">
            <Label htmlFor="stock_actual" className="text-neutral-700 font-medium">
              Stock Actual
            </Label>
            <Input
              id="stock_actual"
              type="number"
              value={formData.stock_actual ?? ''}
              onChange={(e) => handleChange('stock_actual', parseInt(e.target.value))}
              placeholder="0"
              className="border-neutral-300"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock_minimo" className="text-neutral-700 font-medium">
              Stock Mínimo
            </Label>
            <Input
              id="stock_minimo"
              type="number"
              value={formData.stock_minimo ?? ''}
              onChange={(e) => handleChange('stock_minimo', parseInt(e.target.value))}
              placeholder="0"
              className="border-neutral-300"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="costo" className="text-neutral-700 font-medium">
              Costo
            </Label>
            <Input
              id="costo"
              type="number"
              step="0.01"
              value={formData.costo ?? ''}
              onChange={(e) => handleChange('costo', parseFloat(e.target.value))}
              placeholder="0.00"
              className="border-neutral-300"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="porcentaje_recargo" className="text-neutral-700 font-medium">
              % Recargo
            </Label>
            <Input
              id="porcentaje_recargo"
              type="number"
              step="0.1"
              value={formData.porcentaje_recargo ?? ''}
              onChange={(e) => handleChange('porcentaje_recargo', parseFloat(e.target.value))}
              placeholder="0.0"
              className="border-neutral-300"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fecha_vencimiento" className="text-neutral-700 font-medium">
              Fecha Vencimiento
            </Label>
            <Input
              id="fecha_vencimiento"
              type="date"
              value={
                formData.fecha_vencimiento
                  ? new Date(formData.fecha_vencimiento).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                handleChange('fecha_vencimiento', e.target.value ? new Date(e.target.value) : null)
              }
              className="border-neutral-300"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imagen" className="text-neutral-700 font-medium">
              URL de Imagen
            </Label>
            <Input
              id="imagen"
              type="text"
              value={formData.imagen ?? ''}
              onChange={(e) => handleChange('imagen', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="border-neutral-300"
            />
            {formData.imagen && (
              <div className="mt-2 border border-neutral-200 rounded-md overflow-hidden bg-neutral-50 flex items-center justify-center p-2">
                <img
                  src={formData.imagen}
                  alt="Vista previa"
                  className="max-h-32 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Error+al+cargar+imagen';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="border-neutral-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
