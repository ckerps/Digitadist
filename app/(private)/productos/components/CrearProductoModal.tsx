'use client';

import { NuevoProducto } from "@/types/producto";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { EnumPresentacion } from "@prisma/client";
import { NuevoProductoSchema } from "@/repositories/zodSchemas";
import { Package, Plus } from "lucide-react";

interface CrearProductoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (producto: NuevoProducto) => Promise<void>;
}

interface Categoria {
  id: number;
  nombre: string;
}

export function CrearProductoModal({ open, onOpenChange, onSave }: CrearProductoModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    presentacion: 'gramos' as EnumPresentacion,
    tam_pack: '',
    costo: '',
    porcentaje_recargo: '',
    stock_actual: '',
    stock_minimo: '',
    imagen: '',
    categoria_id: '',
    fecha_vencimiento: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchCategorias = async () => {
        try {
          const res = await fetch('/api/categorias');
          if (res.ok) {
            const data = await res.json();
            setCategorias(data);
          }
        } catch (error) {
          console.log("Error al cargar categorías:", error);
        }
      };
      fetchCategorias();
    }
  }, [open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error al modificar
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      nombre: '',
      presentacion: 'gramos' as EnumPresentacion,
      tam_pack: '',
      costo: '',
      porcentaje_recargo: '',
      stock_actual: '',
      stock_minimo: '',
      imagen: '',
      categoria_id: '',
      fecha_vencimiento: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const defaultCategoryId = categorias.length > 0 ? categorias[0].id : 1;

    // Preparar datos parseados para la validación de Zod
    const dataToValidate: any = {
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      presentacion: formData.presentacion,
      tam_pack: formData.tam_pack !== '' ? Number(formData.tam_pack) : undefined,
      costo: formData.costo !== '' ? Number(formData.costo) : undefined,
      porcentaje_recargo: formData.porcentaje_recargo !== '' ? Number(formData.porcentaje_recargo) : undefined,
      stock_actual: formData.stock_actual !== '' ? Number(formData.stock_actual) : undefined,
      stock_minimo: formData.stock_minimo !== '' ? Number(formData.stock_minimo) : undefined,
      imagen: formData.imagen.trim() || undefined,
      categoria_id: defaultCategoryId,
      fecha_vencimiento: formData.fecha_vencimiento !== '' ? new Date(formData.fecha_vencimiento) : undefined,
      activo: true,
    };

    const result = NuevoProductoSchema.safeParse(dataToValidate);

    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      const fieldErrors = result.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (messages && messages.length > 0) {
          validationErrors[key] = messages[0];
        }
      });
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      await onSave(result.data as NuevoProducto);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.log("Error al guardar producto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Plus className="h-6 w-6 text-red-600" />
            Nuevo Producto
          </DialogTitle>
          <DialogDescription>
            Completa los datos para registrar un nuevo producto en el catálogo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-sm">
          {/* Nombre */}
          <div className="grid gap-2">
            <Label htmlFor="nombre" className="text-neutral-700 font-medium">
              Nombre *
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej. Leche Entera"
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
              disabled={isLoading}
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-0.5">{errors.nombre}</p>}
          </div>

          {/* Código */}
          <div className="grid gap-2">
            <Label htmlFor="codigo" className="text-neutral-700 font-medium">
              Código *
            </Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => handleChange('codigo', e.target.value)}
              placeholder="Ej. LEC-ENT-01"
              className="border-neutral-300 focus:border-red-500 focus:ring-red-500"
              disabled={isLoading}
            />
            {errors.codigo && <p className="text-red-500 text-xs mt-0.5">{errors.codigo}</p>}
          </div>

          {/* Categoría asignada automáticamente en el backend */}

          {/* Presentación */}
          <div className="grid gap-2">
            <Label htmlFor="presentacion" className="text-neutral-700 font-medium">
              Presentación *
            </Label>
            <Select
              value={formData.presentacion}
              onValueChange={(val) => handleChange('presentacion', val as EnumPresentacion)}
              disabled={isLoading}
            >
              <SelectTrigger id="presentacion" className="border-neutral-300">
                <SelectValue placeholder="Selecciona presentación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gramos">Gramos (g)</SelectItem>
                <SelectItem value="litros">Litros (l)</SelectItem>
              </SelectContent>
            </Select>
            {errors.presentacion && <p className="text-red-500 text-xs mt-0.5">{errors.presentacion}</p>}
          </div>

          {/* Tamaño de Pack */}
          <div className="grid gap-2">
            <Label htmlFor="tam_pack" className="text-neutral-700 font-medium">
              Tamaño de Pack *
            </Label>
            <Input
              id="tam_pack"
              type="number"
              min="0"
              value={formData.tam_pack}
              onChange={(e) => handleChange('tam_pack', e.target.value)}
              placeholder="Ej. 12"
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.tam_pack && <p className="text-red-500 text-xs mt-0.5">{errors.tam_pack}</p>}
          </div>

          {/* Costo */}
          <div className="grid gap-2">
            <Label htmlFor="costo" className="text-neutral-700 font-medium">
              Costo *
            </Label>
            <Input
              id="costo"
              type="number"
              step="0.01"
              min="0"
              value={formData.costo}
              onChange={(e) => handleChange('costo', e.target.value)}
              placeholder="0.00"
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.costo && <p className="text-red-500 text-xs mt-0.5">{errors.costo}</p>}
          </div>

          {/* Porcentaje de Recargo */}
          <div className="grid gap-2">
            <Label htmlFor="porcentaje_recargo" className="text-neutral-700 font-medium">
              % Recargo *
            </Label>
            <Input
              id="porcentaje_recargo"
              type="number"
              step="0.1"
              min="0"
              value={formData.porcentaje_recargo}
              onChange={(e) => handleChange('porcentaje_recargo', e.target.value)}
              placeholder="0.0"
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.porcentaje_recargo && <p className="text-red-500 text-xs mt-0.5">{errors.porcentaje_recargo}</p>}
          </div>

          {/* Stock Actual */}
          <div className="grid gap-2">
            <Label htmlFor="stock_actual" className="text-neutral-700 font-medium">
              Stock Actual *
            </Label>
            <Input
              id="stock_actual"
              type="number"
              min="0"
              value={formData.stock_actual}
              onChange={(e) => handleChange('stock_actual', e.target.value)}
              placeholder="0"
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.stock_actual && <p className="text-red-500 text-xs mt-0.5">{errors.stock_actual}</p>}
          </div>

          {/* Stock Mínimo */}
          <div className="grid gap-2">
            <Label htmlFor="stock_minimo" className="text-neutral-700 font-medium">
              Stock Mínimo (opcional)
            </Label>
            <Input
              id="stock_minimo"
              type="number"
              min="0"
              value={formData.stock_minimo}
              onChange={(e) => handleChange('stock_minimo', e.target.value)}
              placeholder="0"
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.stock_minimo && <p className="text-red-500 text-xs mt-0.5">{errors.stock_minimo}</p>}
          </div>

          {/* Fecha de Vencimiento */}
          <div className="grid gap-2">
            <Label htmlFor="fecha_vencimiento" className="text-neutral-700 font-medium">
              Fecha Vencimiento (opcional)
            </Label>
            <Input
              id="fecha_vencimiento"
              type="date"
              value={formData.fecha_vencimiento}
              onChange={(e) => handleChange('fecha_vencimiento', e.target.value)}
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.fecha_vencimiento && <p className="text-red-500 text-xs mt-0.5">{errors.fecha_vencimiento}</p>}
          </div>

          {/* Imagen URL */}
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="imagen" className="text-neutral-700 font-medium">
              URL de Imagen (opcional)
            </Label>
            <Input
              id="imagen"
              type="text"
              value={formData.imagen}
              onChange={(e) => handleChange('imagen', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="border-neutral-300"
              disabled={isLoading}
            />
            {errors.imagen && <p className="text-red-500 text-xs mt-0.5">{errors.imagen}</p>}

            {/* Vista previa de imagen */}
            {formData.imagen.trim() && (
              <div className="mt-2 border border-neutral-200 rounded-md overflow-hidden bg-neutral-50 flex items-center justify-center p-2 max-w-xs mx-auto">
                <img
                  src={formData.imagen.trim()}
                  alt="Vista previa"
                  className="max-h-24 object-contain"
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
            onClick={handleClose}
            disabled={isLoading}
            className="border-neutral-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Guardando...' : 'Crear Producto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
