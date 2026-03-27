'use client';

import React, { useState, Suspense } from 'react';
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import {
  ClienteInfoCards,
  EditarClienteModal,
  DesactivarClienteModal,
} from '../components';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { useClienteDetail } from '../hooks/useClienteDetail';
import { usePedidosByCliente } from '../hooks/usePedidosByCliente';
import LoadingPage from '../../../loading';
import ErrorPage from '../../../error';
import { UpdateCliente } from '@/types/cliente';
import { itemsPerPage } from '../../utils';
import { MobilePedidosTable, PedidosTable } from '../../pedidos/components';
import { Pagination } from '../../shared/Pagination';

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
      console.error('Error al actualizar el cliente:', error);
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
      console.error('Error al desactivar el cliente:', error);
    }
  };

  return (
    <div className="h-full w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm mt-1">Clientes</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{cliente.nombre}</h1>
        </div>
        <Button
          onClick={() => router.push('/clientes')}
          size="lg"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
        <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2" onClick={() => setIsDesactivarModalOpen(true)}>
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Desactivar</span>
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full mb-6" />}>
        <ClienteInfoCards cliente={cliente!} />
      </Suspense>

      <div className="mb-2">
        <h1 className="text-xl md:text-2xl font-bold text-neutral-900 inline-flex items-center">
          <Package className="h-6 w-6 mr-2" />
          Pedidos Relacionados
        </h1>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hidden sm:block">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <PedidosTable pedidos={pedidos?.pedidos} />
        </Suspense>
      </div>

      <div className='block sm:hidden'>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <MobilePedidosTable pedidos={pedidos?.pedidos} />
        </Suspense>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pedidos?.totalPages}
        totalItems={pedidos?.totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

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
