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
  CancelarPedidoModal,
  PedidoTimeline
} from '../components';

import { EnumEstadoPedido, EnumEstadoPago, Producto, DetallePedido } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
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
      console.log('Error al cambiar estado del pedido:', error);
    }
  };

  const handleCambiarPago = async (nuevoPago: EnumEstadoPago) => {
    try {
      await updatePedido(+id, { estado_pago: nuevoPago });
      toast.success('Estado de pago actualizado correctamente');
    } catch (error) {
      toast.error(`Error al cambiar pago del pedido: ${(error as Error).message}`);
      console.log('Error al cambiar pago del pedido:', error);
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
      console.log('Error al agregar producto:', error);
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
      console.log('Error al editar cantidad:', error);
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
      console.log('Error al eliminar producto:', error);
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
      console.log('Error al cancelar el pedido:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  const isDisabled = pedido.estado === 'cancelado';
  const puedeEditar = (pedido.estado == "registrado" || pedido.estado == "en_preparacion") && (pedido.estado_pago == "en_deuda");

  return (
    <div className="h-full w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm mt-1">Detalle</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Pedido #{pedido.id}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push('/pedidos')}
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
            onClick={() => setIsCancelarOpen(true)}
            disabled={pedido.estado === 'cancelado'}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Cancelar Pedido</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsCambiarEstadoOpen(true)}
          disabled={pedido.estado === 'cancelado'}
        >
          <Clock className="h-4 w-4" />
          Cambiar estado
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsCambiarPagoOpen(true)}
          disabled={pedido.estado === 'cancelado'}
        >
          <CreditCard className="h-4 w-4" />
          Actualizar pago
        </Button>
        <Button
          variant="default"
          className="gap-2 bg-red-600 hover:bg-red-700"
          onClick={() => setIsAgregarProductoOpen(true)}
          disabled={pedido.estado === 'cancelado' || pedido.estado_pago === 'pagado' || pedido.estado === 'entregado' || pedido.estado === 'finalizado'}
        >
          <Plus className="h-4 w-4" />
          Agregar producto
        </Button>
      </div>

      {/* Timeline Section */}
      <Card>
        <CardContent className="p-2 px-4">
          <PedidoTimeline estado={pedido.estado} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Info & Item Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Buttons */}

          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <PedidoInfo pedido={pedido} />
          </Suspense>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Productos del Pedido
            </h2>
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <DetallePedidoTable productos={pedido?.detallePedidos ?? []} onEditarCantidad={handleEditarCantidad} onDeleteProducto={handleEliminarProducto} />
                </Suspense>
              </div>

              {/* Mobile View */}
              <div className='block sm:hidden'>
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <MobileDetallePedidoTable productos={pedido?.detallePedidos ?? []} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-neutral-200 overflow-hidden">
            <CardHeader className="bg-neutral-50/50 border-b py-4">
              <CardTitle className="text-lg font-bold text-foreground">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(pedido.total + (pedido.descuento || 0))}</span>
              </div>
              {pedido.descuento ? (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>Descuento Aplicado</span>
                  <span className="font-medium">-{formatCurrency(pedido.descuento)}</span>
                </div>
              ) : null}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Final</span>
                <span className="text-2xl font-black text-red-600">
                  {formatCurrency(pedido.total)}
                </span>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <div className={`p-3 rounded-lg flex items-center justify-between ${pedido.estado_pago === 'pagado' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  <span className="text-xs font-bold uppercase tracking-wider">Estado de Pago</span>
                  <span className="text-sm font-bold uppercase">{pedido.estado_pago.replace('_', ' ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
