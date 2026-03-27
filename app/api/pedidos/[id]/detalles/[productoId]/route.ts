import { PedidoService } from '@/services/pedido.service';
import { NextRequest, NextResponse } from 'next/server';
import { UpdateDetallePedidoSchema } from '@/repositories/zodSchemas';

/**
 * PATCH /api/pedidos/[id]/detalles/[productoId]
 * Actualiza la cantidad de un producto en el pedido
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; productoId: string }> }
) {
  try {
    const { id, productoId } = await params;
    const body = await request.json();
    const pedidoId = Number(id);
    const productoIdNum = Number(productoId);

    if (isNaN(pedidoId) || isNaN(productoIdNum)) {
      return NextResponse.json({ error: 'IDs inválidos' }, { status: 400 });
    }

    // Validar datos del detalle actualizado
    const detalleValidado = UpdateDetallePedidoSchema.parse({
      cantidad: body.cantidad,
      precio_unitario: body.precio_unitario,
      descuento: body.descuento,
      subtotal: body.subtotal,
    });


    const pedidoActualizado = await PedidoService.actualizarDetaleProducto(pedidoId, {
      producto_id: productoIdNum,
      cantidad: detalleValidado.cantidad,
      precio_unitario: detalleValidado.precio_unitario,
      descuento: detalleValidado.descuento,
      subtotal: detalleValidado.subtotal,
    });

    return NextResponse.json(pedidoActualizado, { status: 200 });
  } catch (error: any) {
    console.error('Error al actualizar producto en pedido:', error);

    if (error.message?.includes('no existe')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al actualizar producto en pedido' }, { status: 500 });
  }
}

/**
 * DELETE /api/pedidos/[id]/detalles/[productoId]
 * Elimina un producto del pedido
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; productoId: string }> }
) {
  try {
    const { id, productoId } = await params;
    const pedidoId = Number(id);
    const productoIdNum = Number(productoId);

    if (isNaN(pedidoId) || isNaN(productoIdNum)) {
      return NextResponse.json({ error: 'IDs inválidos' }, { status: 400 });
    }

    const pedidoActualizado = await PedidoService.eliminarProducto(pedidoId, productoIdNum);

    return NextResponse.json(pedidoActualizado, { status: 200 });
  } catch (error: any) {
    console.error('Error al eliminar producto del pedido:', error);

    if (error.message?.includes('no existe')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al eliminar producto del pedido' }, { status: 500 });
  }
}
