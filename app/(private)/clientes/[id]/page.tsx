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
import { Card } from '../../../components/ui/card';
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
    <div className="min-h-screen overflow-hidden w-full">
      <div className="mb-2">
        <div className="flex items-start justify-end">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => router.push('/clientes')}
              className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Clientes
            </Button>
            <Button variant="outline" className="border-neutral-300 gap-1" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4" />
              <div className='hidden sm:block'>Editar</div>
            </Button>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 gap-1" onClick={() => setIsDesactivarModalOpen(true)}>
              <Trash2 className="h-4 w-4" />
              <div className='hidden sm:block'>Desactivar</div>
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full mb-6" />}>
        <ClienteInfoCards cliente={cliente!} />
      </Suspense>

      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 inline-flex items-center">
          <Package className="h-6 w-6 mr-2" />
          Pedidos Relacionados
        </h1>
      </div>

      <Card className='hidden sm:block p-0'>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <PedidosTable pedidos={pedidos?.pedidos} />
        </Suspense>
      </Card>

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
