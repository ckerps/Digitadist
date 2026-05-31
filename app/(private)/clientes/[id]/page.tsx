'use client';

import React, { useState, Suspense } from 'react';
import { ArrowLeft, Edit, Trash2, User, Building2, MapPin, Phone, Mail, ShoppingBag, CreditCard, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClienteDetail } from '../hooks/useClienteDetail';
import { usePedidosByCliente } from '../hooks/usePedidosByCliente';
import LoadingPage from '../../../loading';
import ErrorPage from '../../../error';
import { UpdateCliente } from '@/types/cliente';
import { itemsPerPage } from '../../utils';
import { MobilePedidosTable, PedidosTable } from '../../pedidos/components';
import { Pagination } from '../../shared/Pagination';
import {
  EditarClienteModal,
  DesactivarClienteModal,
} from '../components';

export default function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDesactivarModalOpen, setIsDesactivarModalOpen] = useState(false);
  const router = useRouter();

  const { cliente, isLoadingDetail, errorDetail, updateCliente, deleteCliente } = useClienteDetail({ clienteId: +id });
  const { pedidos } = usePedidosByCliente({ clienteId: cliente?.id, itemsPerPage, currentPage });

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  if (!cliente || errorDetail) {
    console.log('Error loading cliente detail:', errorDetail);
    return <ErrorPage message={errorDetail?.message || "Error al cargar el cliente."} />;
  }

  const handleUpdateCliente = async (data: UpdateCliente) => {
    try {
      await updateCliente(+id, data);
      setIsEditModalOpen(false);
      setCurrentPage(1);
      toast.success('Cliente actualizado correctamente');
    } catch (error) {
      toast.error(`Error al actualizar el cliente: ${(error as Error).message}`);
      console.log('Error al actualizar el cliente:', error);
    }
  };

  const handleDesactivarCliente = async () => {
    try {
      await deleteCliente(+id);
      setIsDesactivarModalOpen(false);
      setCurrentPage(1);
      toast.success('Cliente desactivado correctamente');
      router.push('/clientes');
    } catch (error) {
      toast.error(`Error al desactivar el cliente: ${(error as Error).message}`);
      console.log('Error al desactivar the client:', error);
    }
  };

  return (
    <div className="h-full w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 border-2 border-red-50 shadow-sm">
            {cliente.tipo === 'razon_social' ? <Building2 className="h-8 w-8" /> : <User className="h-8 w-8" />}
          </div>
          <div>
            <p className="text-muted-foreground text-sm flex items-center gap-1 uppercase tracking-tight font-bold">
              Cliente / {cliente.tipo === 'razon_social' ? 'Empresa' : 'Persona'}
            </p>
            <h1 className="text-xl md:text-3xl font-bold text-foreground">{cliente.nombre}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push('/clientes')}
            variant="outline"
            className="hidden sm:flex"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="default"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            className="text-destructive border-destructive/20 hover:bg-destructive/5"
            onClick={() => setIsDesactivarModalOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Desactivar Cuenta
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Cards Row */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-neutral-200">
            <CardHeader className="bg-neutral-50/50 border-b py-4">
              <CardTitle className="text-sm font-semibold text-neutral-500 uppercase flex items-center gap-2">
                <User className="h-4 w-4" /> Datos de la cuenta
                <Badge variant="outline" className={cliente.activo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                  {cliente.activo ? 'Vigente' : 'Inactivo'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-100 rounded-lg text-neutral-500">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">CUIT / Identificación</p>
                    <p className="font-medium text-foreground">{cliente.cuit || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-100 rounded-lg text-neutral-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Correo Electrónico</p>
                    <p className="font-medium text-foreground">{cliente.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-100 rounded-lg text-neutral-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Teléfono de Contacto</p>
                    <p className="font-medium text-foreground">{cliente.telefono}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-100 rounded-lg text-neutral-500">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Dirección Principal</p>
                    <p className="font-medium text-foreground">{cliente.direccion}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Pedidos Relacionados
            </h2>
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <div className="hidden sm:block">
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <PedidosTable pedidos={pedidos?.pedidos} />
                </Suspense>
              </div>
              <div className='block sm:hidden'>
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <MobilePedidosTable pedidos={pedidos?.pedidos} />
                </Suspense>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={pedidos?.totalPages}
              totalItems={pedidos?.totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>


      </div>

      <EditarClienteModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleUpdateCliente}
        cliente={cliente}
      />

      <DesactivarClienteModal
        open={isDesactivarModalOpen}
        onOpenChange={setIsDesactivarModalOpen}
        onConfirm={handleDesactivarCliente}
        cliente={cliente}
      />
    </div>
  );
}
