'use client';

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Producto } from "@prisma/client";
import { useProductos } from "../../productos/hooks/useProductos";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../../../components/ui/combobox";

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
  const [searchValue, setSearchValue] = useState('');
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [precioUnitario, setPrecioUnitario] = useState<number | ''>('');
  const [descuento, setDescuento] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const { productos } = useProductos({
    itemsPerPage: 10,
    currentPage: 1,
    filters: { activo: true, nombre: searchValue.length > 0 ? searchValue : undefined }
  });

  const filteredProductos = productos?.productos || [];

  const handleSelectProduct = (producto: Producto) => {
    setSelectedProducto(producto);
    const precioTotal = parseFloat(producto.costo as any) + producto.porcentaje_recargo;
    setPrecioUnitario(precioTotal);
    setSearchValue('');
    setError('');
  };

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

    if (precioUnitario === '' || precioUnitario <= 0) {
      setError('El precio unitario debe ser mayor a 0');
      return;
    }

    const precioNum = typeof precioUnitario === 'string' ? parseFloat(precioUnitario) : precioUnitario;
    const subtotal = (precioNum * cantidad) - (descuento || 0);

    if (subtotal <= 0) {
      setError('El subtotal no puede ser menor o igual a 0');
      return;
    }

    try {
      await onConfirm({
        producto_id: selectedProducto.id,
        cantidad,
        precio_unitario: precioNum,
        descuento: descuento || undefined,
        subtotal
      });

      // Reset form
      setSelectedProducto(null);
      setCantidad(1);
      setPrecioUnitario('');
      setDescuento(0);
      setSearchValue('');
      onOpenChange(false);
    } catch (err) {
      setError('Error al agregar el producto. Intenta de nuevo.');
    }
  };

  const subtotalCalculado = selectedProducto && precioUnitario !== ''
    ? ((typeof precioUnitario === 'string' ? parseFloat(precioUnitario) : precioUnitario) * cantidad) - (descuento || 0)
    : 0;

  const formatCurrency = (value: number | string) => {
    return parseFloat(value as any).toLocaleString('es-AR', {
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
          {/* Product Selection */}
          <div className="space-y-2">
            <Label className="text-neutral-700 font-medium">Producto</Label>
            {selectedProducto ? (
              <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-3">
                <p className="font-medium text-neutral-900">{selectedProducto.nombre}</p>
                <p className="text-sm text-neutral-600">Código: {selectedProducto.codigo}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProducto(null)}
                  className="mt-2 border-neutral-300"
                >
                  Cambiar
                </Button>
              </div>
            ) : (
              <Combobox
                items={filteredProductos}
                value={searchValue}
                onValueChange={(value) => setSearchValue(value ?? '')}
              >
                <ComboboxInput placeholder="Buscar producto..." className="h-10 w-full" />
                <ComboboxContent>
                  <ComboboxEmpty>Producto no encontrado.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: Producto) => (
                      <ComboboxItem key={item?.id} onClick={() => handleSelectProduct(item)}>
                        {item?.nombre} - {item?.codigo} - Stock: {item?.stock_actual}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          </div>

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

              {/* Precio Unitario */}
              <div className="space-y-2">
                <Label htmlFor="precio" className="text-neutral-700 font-medium">
                  Precio Unitario ($)
                </Label>
                <Input
                  id="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(e.target.value === '' ? '' : parseFloat(e.target.value))}
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

              {/* Subtotal Preview */}
              {precioUnitario !== '' && (
                <div className="bg-neutral-100 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-700">Subtotal:</span>
                    <span className="font-bold text-neutral-900">${formatCurrency(subtotalCalculado)}</span>
                  </div>
                </div>
              )}
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
              setPrecioUnitario('');
              setDescuento(0);
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
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Agregando...' : 'Agregar Producto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
