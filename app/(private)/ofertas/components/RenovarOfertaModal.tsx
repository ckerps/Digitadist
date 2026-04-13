'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function RenovarOfertaModal({ ofertaId, onRenewComplete }: { ofertaId: number, onRenewComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateStr, setDateStr] = useState<string>('');

  const handleRenew = async () => {
    if (!dateStr) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/ofertas/${ofertaId}/renovar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nueva_fecha_fin: new Date(dateStr).toISOString() })
      });
      if (!res.ok) throw new Error();
      toast.success('Oferta renovada exitosamente');
      setIsOpen(false);
      onRenewComplete();
    } catch {
      toast.error('Error al renovar oferta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()} className="h-8 shadow-sm border border-neutral-200">
          <RefreshCw className="h-4 w-4 mr-1 text-blue-600" /> Renovar
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Renovar Oferta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nueva fecha de finalización</label>
            <Input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleRenew} disabled={!dateStr || loading}>{loading ? 'Renovando...' : 'Confirmar'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
