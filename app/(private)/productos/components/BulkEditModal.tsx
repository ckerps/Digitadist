'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers } from 'lucide-react';
import { toast } from 'sonner';

export function BulkEditModal({ onUpdateComplete }: { onUpdateComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState<'porcentaje' | 'fijo'>('porcentaje');
  const [valor, setValor] = useState<string>('');

  const procesarBulkEdit = async () => {
    if (!valor || isNaN(Number(valor))) {
        toast.error('Ingrese un valor válido');
        return;
    }

    setLoading(true);

    try {
        const res = await fetch('/api/productos/bulk-edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo,
                valor: Number(valor),
                producto_ids: 'todos', // Por defecto todos para este caso, se podría expandir a seleccionados.
                usuario_id: 1 // TODO: get current session user id if needed for logging
            })
        });

        if (res.ok) {
            const data = await res.json();
            toast.success(`Se actualizaron ${data.count} productos exitosamente.`);
            setIsOpen(false);
            onUpdateComplete();
        } else {
            toast.error('Error al actualizar productos.');
        }
    } catch (e) {
        toast.error("Error de red.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Layers className="h-4 w-4 mr-2" />
          Edición Masiva
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modificar Precios Masivamente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-neutral-500">
            Aplica un aumento o descuento global a los costos base de todos los productos actuales en el catálogo.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700">Tipo de Modificación</label>
                <Select value={tipo} onValueChange={(v: 'porcentaje' | 'fijo') => setTipo(v)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="porcentaje">Porcentaje (%)</SelectItem>
                        <SelectItem value="fijo">Monto Fijo ($)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700">Valor</label>
                <Input 
                    type="number" 
                    placeholder="Ej: 15 o -5" 
                    value={valor} 
                    onChange={e => setValor(e.target.value)} 
                />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={procesarBulkEdit} disabled={loading || !valor}>
                {loading ? 'Aplicando...' : 'Aplicar Modificación'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
