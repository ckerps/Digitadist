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
import { Card } from '@/components/ui/card';

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
    if (!puedeEditar) {
      toast.info("No es posible editar el pedido en esta etapa.")
      return;
    }
    setDetalleSeleccionado(detalle);
    setIsEditarCantidadOpen(true);
  };

  const handleConfirmarEditarCantidad = async (cantidad: number, subtotal: number, descuento?: number) => {
    if (!detalleSeleccionado) return;
    try {
      await editarCantidad(+id, detalleSeleccionado.producto_id, cantidad, subtotal, detalleSeleccionado.precio_unitario, descuento ?? undefined);
      setIsEditarCantidadOpen(false);
      setDetalleSeleccionado(null);
      toast.success('Cantidad actualizada correctamente');
    } catch (error) {
      toast.error(`Error al editar cantidad: ${(error as Error).message}`);
      console.error('Error al editar cantidad:', error);
    }
  };

  const handleEliminarProducto = async (productoId: number, pedidoId: number) => {
    if (!puedeEditar) {
      toast.info("No es posible editar el pedido en esta etapa.")
      return;
    }
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
    if (!puedeEditar) {
      toast.info("No es posible cancelar el pedido en esta etapa. Revise el estado o pago.")
      return;
    }
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
  const puedeEditar = (pedido.estado == "registrado" || pedido.estado == "en_preparacion") && (pedido.estado_pago == "en_deuda");

  return (
    <div className="h-full w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm mt-1">Pedidos</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Pedido #{pedido.id}</h1>
        </div>
        <Button
          onClick={() => router.push('/pedidos')}
          size="lg"
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsCambiarEstadoOpen(true)}
          disabled={pedido.estado === 'cancelado'}
        >
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Cambiar estado</span>
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsCambiarPagoOpen(true)}
          disabled={pedido.estado === 'cancelado'}
        >
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Actualizar pago</span>
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsAgregarProductoOpen(true)}
          disabled={pedido.estado === 'cancelado'}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Agregar producto</span>
        </Button>
        <Button
          variant="outline"
          className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
          onClick={() => setIsCancelarOpen(true)}
          disabled={pedido.estado === 'cancelado'}
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Cancelar</span>
        </Button>
      </div>

      {/* Pedido Info */}
      <Suspense fallback={<Skeleton className="h-32 w-full mb-6" />}>
        <PedidoInfo pedido={pedido} />
      </Suspense>

      {/* Detalle Pedido Section */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-neutral-900 inline-flex items-center">
          <Package className="h-6 w-6 mr-2" />
          Productos del Pedido
        </h1>
      </div>

      {/* Desktop Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hidden sm:block mb-6">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <DetallePedidoTable productos={pedido?.detallePedidos ?? []} onEditarCantidad={handleEditarCantidad} onDeleteProducto={handleEliminarProducto} />
        </Suspense>
      </div>

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
          precioUnitario={detalleSeleccionado.precio_unitario}
          descuentoActual={detalleSeleccionado.descuento ? detalleSeleccionado.descuento : 0}
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
