import { PedidoService } from '@/services/pedido.service';
import { NextRequest, NextResponse } from 'next/server';
import { NuevoDetallePedidoSchema } from '@/repositories/zodSchemas';

/**
 * @swagger
 * /api/pedidos/{id}/detalles:
 *   post:
 *     summary: Agrega un nuevo producto (detalle) al pedido existente
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido al cual agregar el detalle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - producto_id
 *               - cantidad
 *               - precio_unitario
 *             properties:
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *               descuento:
 *                 type: number
 *                 default: 0
 *               subtotal:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto agregado exitosamente al pedido
 *       400:
 *         description: ID de pedido inválido o datos incorrectos
 *       404:
 *         description: El pedido o producto no existe
 *       500:
 *         description: Error al agregar producto al pedido
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const pedidoId = Number(id);

    if (isNaN(pedidoId)) {
      return NextResponse.json({ error: 'ID de pedido inválido' }, { status: 400 });
    }

    // Validar datos del detalle
    const detalleValidado = NuevoDetallePedidoSchema.parse({
      producto_id: body.producto_id,
      pedido_id: pedidoId,
      cantidad: body.cantidad,
      precio_unitario: body.precio_unitario,
      descuento: body.descuento || 0,
      subtotal: body.subtotal,
    });

    const pedidoActualizado = await PedidoService.agregarProducto(pedidoId, {
      producto_id: detalleValidado.producto_id,
      cantidad: detalleValidado.cantidad,
      precio_unitario: detalleValidado.precio_unitario,
      descuento: detalleValidado.descuento,
      subtotal: detalleValidado.subtotal,
    });

    return NextResponse.json(pedidoActualizado, { status: 201 });
  } catch (error: any) {
    console.log('Error al agregar producto al pedido:', error);

    if (error.message?.includes('no existe')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al agregar producto al pedido' }, { status: 500 });
  }
}
