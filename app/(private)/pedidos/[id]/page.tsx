'use client';

import React, { useState, Suspense } from 'react';
import { ArrowLeft, Plus, Trash2, Package, Clock, CreditCard, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { usePedidoDetail } from '../hooks/usePedidoDetail';
import LoadingPage from '../../../loading';
import ErrorPage from '../../../error';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '../../shared/Pagination';
import { itemsPerPage } from '../../utils';
import {
  PedidoInfo,
  DetallePedidoTable,
  MobileDetallePedidoTable,
  CambiarEstadoModal,
  CambiarPagoModal,
  AgregarProductoModal,
  EditarCantidadModal,
  CancelarPedidoModal
} from '../components';
import { EnumEstadoPedido, EnumEstadoPago, Producto, DetallePedido } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '../../../components/ui/card';

export default function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCambiarEstadoOpen, setIsCambiarEstadoOpen] = useState(false);
  const [isCambiarPagoOpen, setIsCambiarPagoOpen] = useState(false);
  const [isAgregarProductoOpen, setIsAgregarProductoOpen] = useState(false);
  const [isEditarCantidadOpen, setIsEditarCantidadOpen] = useState(false);
  const [isCancelarOpen, setIsCancelarOpen] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<(DetallePedido & { producto: Producto }) | null>(null);
  const router = useRouter();

  const { 
    pedido, 
    deletePedido, 
    updatePedido, 
    agregarProducto,
    editarCantidad,
    eliminarProducto,
    isLoadingDetail, 
    errorDetail, 
    isUpdating, 
    isDeleting 
  } = usePedidoDetail({ pedidoId: +id });

  if (isLoadingDetail) {
    return <LoadingPage />;
  }

  if (!pedido || errorDetail) {
    console.log('Error loading pedido detail:', errorDetail);
    return <ErrorPage message={errorDetail?.message || "Error al cargar el pedido."} />;
  }

  const handleCambiarEstado = async (nuevoEstado: EnumEstadoPedido) => {
    try {
      await updatePedido(+id, { estado: nuevoEstado });
      toast.success('Estado del pedido actualizado correctamente');
    } catch (error) {
      toast.error(`Error al cambiar estado del pedido: ${(error as Error).message}`);
      console.error('Error al cambiar estado del pedido:', error);
    }
  };

  const handleCambiarPago = async (nuevoPago: EnumEstadoPago) => {
    try {
      await updatePedido(+id, { estado_pago: nuevoPago });
      toast.success('Estado de pago actualizado correctamente');
    } catch (error) {
      toast.error(`Error al cambiar pago del pedido: ${(error as Error).message}`);
      console.error('Error al cambiar pago del pedido:', error);
    }
  };

  const handleAgregarProducto = async (productoData: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    descuento?: number;
    subtotal: number;
  }) => {
    try {
      await agregarProducto(+id, productoData);
      setIsAgregarProductoOpen(false);
      toast.success('Producto agregado al pedido correctamente');
    } catch (error) {
      toast.error(`Error al agregar producto: ${(error as Error).message}`);
      console.error('Error al agregar producto:', error);
    }
  };

  const handleEditarCantidad = (detalle: DetallePedido & { producto: Producto }) => {
    setDetalleSeleccionado(detalle);
    setIsEditarCantidadOpen(true);
  };

  const handleConfirmarEditarCantidad = async (cantidad: number, subtotal: number) => {
    if (!detalleSeleccionado) return;

    try {
      await editarCantidad(+id, detalleSeleccionado.producto_id, cantidad, subtotal, detalleSeleccionado.precio_unitario, parseFloat(detalleSeleccionado.descuento as any) || 0);
      setIsEditarCantidadOpen(false);
      setDetalleSeleccionado(null);
      toast.success('Cantidad actualizada correctamente');
    } catch (error) {
      toast.error(`Error al editar cantidad: ${(error as Error).message}`);
      console.error('Error al editar cantidad:', error);
    }
  };

  const handleEliminarProducto = async (productoId: number, pedidoId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este producto del pedido?')) {
      return;
    }
    
    try {
      await eliminarProducto(pedidoId, productoId);
      toast.success('Producto eliminado del pedido correctamente');
    } catch (error) {
      toast.error(`Error al eliminar producto: ${(error as Error).message}`);
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleCancelarPedido = async () => {
    try {
      await deletePedido(+id);
      setIsCancelarOpen(false);
      toast.success('Pedido cancelado correctamente');
      router.push('/pedidos');
    } catch (error) {
      toast.error(`Error al cancelar el pedido: ${(error as Error).message}`);
      console.error('Error al cancelar el pedido:', error);
    }
  };

  const isDisabled = pedido.estado === 'cancelado';

  return (
    <div className="min-h-screen overflow-hidden w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/pedidos')}
            className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Pedidos
          </Button>
          <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
            <Button
              variant="outline"
              className="border-neutral-300 gap-1"
              onClick={() => setIsCambiarEstadoOpen(true)}
              disabled={pedido.estado === 'cancelado'}
            >
              <Clock className="h-4 w-4" />
              <div className='hidden sm:block'>Estado</div>
            </Button>
            <Button
              variant="outline"
              className="border-neutral-300 gap-1"
              onClick={() => setIsCambiarPagoOpen(true)}
              disabled={pedido.estado === 'cancelado'}
            >
              <CreditCard className="h-4 w-4" />
              <div className='hidden sm:block'>Pago</div>
            </Button>
            <Button
              variant="outline"
              className="border-neutral-300 gap-1"
              onClick={() => setIsAgregarProductoOpen(true)}
              disabled={pedido.estado === 'cancelado'}
            >
              <Plus className="h-4 w-4" />
              <div className='hidden sm:block'>Agregar</div>
            </Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 gap-1"
              onClick={() => setIsCancelarOpen(true)}
              disabled={pedido.estado === 'cancelado'}
            >
              <Trash2 className="h-4 w-4" />
              <div className='hidden sm:block'>Cancelar</div>
            </Button>
          </div>
        </div>
      </div>

      {/* Pedido Info */}
      <Suspense fallback={<Skeleton className="h-32 w-full mb-6" />}>
        <PedidoInfo pedido={pedido} />
      </Suspense>

      {/* Detalle Pedido Section */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 inline-flex items-center">
          <Package className="h-6 w-6 mr-2" />
          Productos del Pedido
        </h1>
      </div>

      {/* Desktop Table */}
      <Card className='hidden sm:block p-0 mb-6'>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <DetallePedidoTable productos={pedido?.detallePedidos ?? []} />
        </Suspense>
      </Card>

      {/* Mobile View */}
      <div className='block sm:hidden mb-6'>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <MobileDetallePedidoTable productos={pedido?.detallePedidos ?? []} />
        </Suspense>
      </div>

      {/* Modals */}
      <CambiarEstadoModal
        open={isCambiarEstadoOpen}
        onOpenChange={setIsCambiarEstadoOpen}
        onConfirm={handleCambiarEstado}
        estadoActual={pedido.estado}
        isLoading={isUpdating}
      />

      <CambiarPagoModal
        open={isCambiarPagoOpen}
        onOpenChange={setIsCambiarPagoOpen}
        onConfirm={handleCambiarPago}
        estadoPagoActual={pedido.estado_pago}
        isLoading={isUpdating}
      />

      <AgregarProductoModal
        open={isAgregarProductoOpen}
        onOpenChange={setIsAgregarProductoOpen}
        onConfirm={handleAgregarProducto}
        isLoading={isUpdating}
      />

      {detalleSeleccionado && (
        <EditarCantidadModal
          open={isEditarCantidadOpen}
          onOpenChange={setIsEditarCantidadOpen}
          onConfirm={handleConfirmarEditarCantidad}
          cantidadActual={detalleSeleccionado.cantidad}
          precioUnitario={parseFloat(detalleSeleccionado.precio_unitario as any)}
          descuentoActual={detalleSeleccionado.descuento ? parseFloat(detalleSeleccionado.descuento as any) : 0}
          isLoading={isUpdating}
        />
      )}

      <CancelarPedidoModal
        open={isCancelarOpen}
        onOpenChange={setIsCancelarOpen}
        onConfirm={handleCancelarPedido}
        pedidoId={pedido.id}
        isLoading={isDeleting}
      />
    </div>
  );
}
