'use client';

import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useProductos } from "../../productos/hooks/useProductos";
import { Check } from "lucide-react";
import SelectProducto from "../../shared/SelectProducto";
import { Producto } from "@/types/producto";

interface AgregarProductoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (producto: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    descuento?: number;
    subtotal: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function AgregarProductoModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading
}: AgregarProductoModalProps) {
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [descuento, setDescuento] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');

  const handleSelectProduct = (producto: Producto | null) => {
    setSelectedProducto(producto);
    setSearchValue('');
    setError('');
  };

  const calcularPrecioUnitario = (producto: Producto): number => {
    // Precio unitario = costo * (1 + porcentaje_recargo / 100)
    const costo = parseFloat(producto.costo as any);
    const recargo = producto.porcentaje_recargo || 0;
    return costo * (1 + recargo / 100);
  };

  const precioUnitario = selectedProducto ? calcularPrecioUnitario(selectedProducto) : 0;
  const subtotalCalculado = (precioUnitario * cantidad) - descuento;

  const handleConfirm = async () => {
    setError('');

    if (!selectedProducto) {
      setError('Debe seleccionar un producto');
      return;
    }

    if (!cantidad || cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (subtotalCalculado <= 0) {
      setError('El subtotal no puede ser menor o igual a 0');
      return;
    }

    try {
      await onConfirm({
        producto_id: selectedProducto.id,
        cantidad,
        precio_unitario: precioUnitario,
        descuento: descuento > 0 ? descuento : undefined,
        subtotal: subtotalCalculado
      });

      // Reset form
      setSelectedProducto(null);
      setCantidad(1);
      setDescuento(0);
      setSearchValue('');
      onOpenChange(false);
    } catch (err) {
      setError('Error al agregar el producto. Intenta de nuevo.');
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900">Agregar Producto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <SelectProducto selectedProducto={selectedProducto} handleSelectProduct={handleSelectProduct} searchValue={searchValue} setSearchValue={setSearchValue}/>

          {selectedProducto && (
            <>
              {/* Cantidad */}
              <div className="space-y-2">
                <Label htmlFor="cantidad" className="text-neutral-700 font-medium">
                  Cantidad
                </Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                  className="border-neutral-300"
                />
              </div>

              {/* Descuento */}
              <div className="space-y-2">
                <Label htmlFor="descuento" className="text-neutral-700 font-medium">
                  Descuento ($)
                </Label>
                <Input
                  id="descuento"
                  type="number"
                  min="0"
                  step="0.01"
                  value={descuento}
                  onChange={(e) => setDescuento(parseFloat(e.target.value) || 0)}
                  className="border-neutral-300"
                />
              </div>

              {/* Información de precios */}
              <div className="bg-neutral-100 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Precio Unitario:</span>
                  <span className="font-semibold text-neutral-900">${formatCurrency(precioUnitario)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-300 pt-2">
                  <span className="text-neutral-700 font-medium">Subtotal:</span>
                  <span className="font-bold text-neutral-900">${formatCurrency(subtotalCalculado)}</span>
                </div>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedProducto(null);
              setCantidad(1);
              setDescuento(0);
              setSearchValue('');
              setError('');
            }}
            className="border-neutral-300"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !selectedProducto}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Agregando...' : 'Agregar Producto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
