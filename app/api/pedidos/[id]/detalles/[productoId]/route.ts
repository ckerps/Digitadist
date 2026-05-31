import { PedidoService } from '@/services/pedido.service';
import { NextRequest, NextResponse } from 'next/server';
import { UpdateDetallePedidoSchema } from '@/repositories/zodSchemas';

/**
 * @swagger
 * /api/pedidos/{id}/detalles/{productoId}:
 *   patch:
 *     summary: Actualiza la cantidad o datos de un producto (detalle) en el pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *       - in: path
 *         name: productoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *               descuento:
 *                 type: number
 *               subtotal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto en el pedido actualizado exitosamente
 *       400:
 *         description: IDs inválidos o datos incorrectos
 *       404:
 *         description: El pedido o el producto no existe en el pedido
 *       500:
 *         description: Error al actualizar producto en el pedido
 *   delete:
 *     summary: Elimina un producto (detalle) del pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *       - in: path
 *         name: productoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a eliminar del pedido
 *     responses:
 *       200:
 *         description: Producto eliminado del pedido exitosamente
 *       400:
 *         description: IDs inválidos
 *       404:
 *         description: El pedido o el producto no existe en el pedido
 *       500:
 *         description: Error al eliminar producto del pedido
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
    console.log('Error al actualizar producto en pedido:', error);

    if (error.message?.includes('no existe')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al actualizar producto en pedido' }, { status: 500 });
  }
}

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
    console.log('Error al eliminar producto del pedido:', error);

    if (error.message?.includes('no existe')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al eliminar producto del pedido' }, { status: 500 });
  }
}
