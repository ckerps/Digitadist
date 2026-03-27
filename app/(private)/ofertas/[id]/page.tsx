'use client';

import React, { useState, Suspense } from 'react';
import { ArrowLeft, Edit, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { OfertaInfoCards } from '../components';
import LoadingPage from '../../../loading';
import ErrorPage from '../../../error';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useOfertaDetail } from '../hooks/useOfertaDetail';
import { EditarOfertaModal } from '../components/EditarOfertaModal';
import { ActualizarOferta } from '@/types/oferta';
import { DatePicker } from '../../../components/ui/datepicker';

export default function OfertaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [showRenovarDialog, setShowRenovarDialog] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);

  const router = useRouter();

  const { oferta, isLoadingDetail, errorDetail, deleteOferta, renovarOferta, updateOferta } = useOfertaDetail({ ofertaId: +id });

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  if (!oferta || errorDetail) {
    console.log('Error loading oferta detail:', errorDetail);
    return <ErrorPage message={errorDetail?.message || "Error al cargar la oferta."} />;
  }

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro de que desea desactivar esta oferta?")) {
      try {
        await deleteOferta(+id);
        toast.success('Oferta desactivada correctamente');
        router.push('/ofertas');
      } catch (error) {
        toast.error(`Error al desactivar la oferta: ${(error as Error).message}`);
        console.error('Error al desactivar la oferta:', error);
      }
    }
  };

  const handleRenovar = async (nuevaFechaFin: string) => {
    if (!nuevaFechaFin) {
      toast.error("Debe seleccionar una fecha");
      return;
    }
    try {
      await renovarOferta(+id, { nueva_fecha_fin: new Date(nuevaFechaFin) });
      setShowRenovarDialog(false);
      toast.success('Oferta renovada correctamente');
    } catch (error) {
      toast.error(`Error al renovar la oferta: ${(error as Error).message}`);
      console.error('Error al renovar la oferta:', error);
    }
  };

  const handleUpdateOferta = async (data: ActualizarOferta) => {
    try {
      await updateOferta(+id, data);
      setEditarModalOpen(false);
      toast.success('Oferta actualizada correctamente');
    } catch (error) {
      toast.error(`Error al actualizar la oferta: ${(error as Error).message}`);
      console.error('Error al actualizar la oferta:', error);
    }
  };

  return (
    <div className="full w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/ofertas')}
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-sm text-neutral-600">Ofertas</p>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Oferta #{oferta.id}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog open={showRenovarDialog} onOpenChange={setShowRenovarDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-neutral-200 gap-2">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Renovar</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Renovar Oferta</DialogTitle>
                <DialogDescription>
                  Selecciona la nueva fecha de vencimiento
                </DialogDescription>
              </DialogHeader>
              <RenovarOfertaForm onRenovar={handleRenovar} onCancel={() => setShowRenovarDialog(false)} />
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="border-neutral-200 gap-2"
            onClick={() => setEditarModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Editar</span>
          </Button>

          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 gap-2"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Desactivar</span>
          </Button>
        </div>
      </div>

      {/* Info Cards Section */}
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <OfertaInfoCards oferta={oferta!} />
      </Suspense>

      {/* Modals */}
      <EditarOfertaModal
        open={editarModalOpen}
        onOpenChange={setEditarModalOpen}
        onSave={handleUpdateOferta}
        oferta={oferta}
      />
    </div>
  );
}

function RenovarOfertaForm({ onRenovar, onCancel }: { onRenovar: (fecha: string) => void; onCancel: () => void }) {
  const [nuevaFechaFin, setNuevaFechaFin] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nueva_fecha">Nueva Fecha de Fin</Label>
        <DatePicker
          fecha={nuevaFechaFin}
          onChange={(date) => setNuevaFechaFin(date ?? "")}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => onRenovar(nuevaFechaFin)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Renovar
        </Button>
      </div>
    </div>
  );
}
