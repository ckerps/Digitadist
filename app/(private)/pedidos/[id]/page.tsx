'use client';

import React, { useState, Suspense } from 'react';
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { usePedidoDetail } from '../hooks/usePedidoDetail';
import LoadingPage from '../../../loading';
import ErrorPage from '../../../error';
import { UpdatePedido } from '@/types/pedido';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '../../../components/ui/card';
import { ListaProductosSeleccionados } from '../components/ListaProductosSeleccionados';
import { Pagination } from '../../shared/Pagination';
import { itemsPerPage } from '../../utils';

export default function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDesactivarModalOpen, setIsDesactivarModalOpen] = useState(false);
  const router = useRouter();

  const { pedido, deletePedido, updatePedido, isLoadingDetail, errorDetail } = usePedidoDetail({ pedidoId: +id });

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  if (!pedido || errorDetail) {
    console.log('Error loading pedido detail:', errorDetail);
    return <ErrorPage message={errorDetail?.message || "Error al cargar el pedido."} />;
  }

  const { productos } = useProductosByPedido({ pedidoId: pedido.id, itemsPerPage, currentPage });

  const handleUpdatePedido = async (pedido: UpdatePedido) => {
    try {
      await updatePedido(+id, pedido);
      setIsEditModalOpen(false);
      setCurrentPage(1);
      //@TODO: toast
    } catch (error) {
      //@TODO: toast
      console.error('Error al actualizar el pedido:', error);
    }
  };

  const handleDesactivarPedido = async () => {
    try {
      await deletePedido(+id);
      setIsDesactivarModalOpen(false);
      setCurrentPage(1);
      //@TODO: toast
      router.push('/pedidos');
    } catch (error) {
      //@TODO: toast
      console.error('Error al desactivar el pedido:', error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden w-full">
      <div className="mb-2">
        <div className="flex items-start justify-end">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => router.push('/pedidos')}
              className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Pedidos
            </Button>
            <Button variant="outline" className="border-neutral-300 gap-1" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4" />
              <div className='hidden sm:block'>Editar</div>
            </Button>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 gap-1" onClick={() => setIsDesactivarModalOpen(true)}>
              <Trash2 className="h-4 w-4" />
              <div className='hidden sm:block'>Cancelar</div>
            </Button>
          </div>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-32 w-full mb-6" />}>
        <PedidoInfo pedido={pedido} />
      </Suspense>

      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 inline-flex items-center">
          <Package className="h-6 w-6 mr-2" />
          Detalle Pedido
        </h1>
      </div>

      <Card className='hidden sm:block p-0'>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <DetallePedidoTable productos={pedido?.detallePedido ?? []} />
        </Suspense>
      </Card>

      <div className='block sm:hidden'>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <MobileDetallePedidoTable productos={pedido?.detallePedido} />
        </Suspense>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={pedido?.totalPages}
        totalItems={pedidos?.totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      <ClienteForm
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
