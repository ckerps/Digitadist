'use client';

import React, { useState, Suspense } from 'react';
import { ArrowLeft, Edit, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { OfertaInfoCards, DesactivarOfertaModal, EditarOfertaModal } from '../components';
import LoadingPage from '../../../loading';
import ErrorPage from '../../../error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useOfertaDetail } from '../hooks/useOfertaDetail';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, Percent, DollarSign, Calendar, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ActualizarOferta } from '@/types/oferta';
import { DatePicker } from '@/components/ui/datepicker';


export default function OfertaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [showRenovarDialog, setShowRenovarDialog] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [desactivarModalOpen, setDesactivarModalOpen] = useState(false);

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
    try {
      await deleteOferta(+id);
      setDesactivarModalOpen(false);
      toast.success('Oferta desactivada correctamente');
      router.push('/ofertas');
    } catch (error) {
      toast.error(`Error al desactivar la oferta: ${(error as Error).message}`);
      console.error('Error al desactivar la oferta:', error);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  // Cálculo de precios
  const costo = Number(oferta.producto.costo);
  const recargo = Number(oferta.producto.porcentaje_recargo);
  const precioOriginal = costo * (1 + recargo / 100);

  const precioOferta = oferta.tipo === 'porcentaje'
    ? precioOriginal * (1 - oferta.valor / 100)
    : precioOriginal - oferta.valor;

  const ahorro = precioOriginal - precioOferta;

  return (
    <div className="h-full w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm mt-1">Ofertas / Detalle</p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Oferta #{oferta.id}</h1>
            <Badge
              variant="outline"
              className={oferta.activa ? 'bg-green-50 border-green-300 text-green-700' : 'bg-neutral-100 border-neutral-300 text-neutral-600'}
            >
              {oferta.activa ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push('/ofertas')}
            size="lg"
            variant="outline"
            className="hidden sm:flex"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
            onClick={() => setDesactivarModalOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Desactivar</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Producto Card */}
        <Card className="md:col-span-1 border-neutral-200">
          <CardHeader className="bg-neutral-50/50 border-b py-4">
            <CardTitle className="text-sm font-semibold text-neutral-500 uppercase flex items-center gap-2">
              <Package className="h-4 w-4" /> Producto Asociado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-full aspect-square max-w-[200px] bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden border">
                {oferta.producto.imagen ? (
                  <img src={oferta.producto.imagen} alt={oferta.producto.nombre} className="object-contain w-full h-full" />
                ) : (
                  <Package className="h-10 w-20 text-neutral-300" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{oferta.producto.nombre}</h2>
                <p className="text-sm text-muted-foreground font-mono">{oferta.producto.codigo}</p>
                <Button
                  variant="link"
                  className="text-red-600 p-0 h-auto text-sm mt-2"
                  onClick={() => router.push(`/productos/${oferta.producto.id}`)}
                >
                  Ver detalle del producto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalle de Oferta Card */}
        <div className="md:col-span-1 lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Precio Original */}
            <Card className="border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-neutral-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase">Precio Original</p>
                  <p className="text-lg font-semibold line-through text-neutral-400">{formatCurrency(precioOriginal)}</p>
                </div>
              </div>
            </Card>

            {/* Precio con Oferta */}
            <Card className="border-red-200 bg-red-50/30 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-red-600 font-bold uppercase">Precio Especial</p>
                  <p className="text-2xl font-black text-red-600">{formatCurrency(precioOferta)}</p>
                </div>
              </div>
            </Card>

            {/* Descuento Aplicado */}
            <Card className="border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Percent className="h-5 w-5 text-neutral-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase">Ahorro total</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(ahorro)} ({oferta.tipo === 'porcentaje' ? `${oferta.valor}% OFF` : `Monto fijo`})
                  </p>
                </div>
              </div>
            </Card>

            {/* Vigencia */}
            <Card className="border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium uppercase">Vigencia</p>
                  <p className="text-sm font-medium">
                    {new Intl.DateTimeFormat('es-AR').format(new Date(oferta.fecha_inicio))} al {new Intl.DateTimeFormat('es-AR').format(new Date(oferta.fecha_fin))}
                  </p>
                </div>
                <Dialog open={showRenovarDialog} onOpenChange={setShowRenovarDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-600 h-8 px-2 hover:bg-red-50">
                      <RefreshCw className="h-3 w-3 mr-1" /> Renovar
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
              </div>
            </Card>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => setEditarModalOpen(true)}
            >
              <Edit className="h-4 w-4" />
              Editar Oferta
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditarOfertaModal
        open={editarModalOpen}
        onOpenChange={setEditarModalOpen}
        onSave={handleUpdateOferta}
        oferta={oferta}
      />

      <DesactivarOfertaModal
        isOpen={desactivarModalOpen}
        onClose={() => setDesactivarModalOpen(false)}
        onConfirm={handleDelete}
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
