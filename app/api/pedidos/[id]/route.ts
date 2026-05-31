import { PedidoService } from '@/services/pedido.service';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtiene un pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a obtener
 *     responses:
 *       200:
 *         description: Pedido obtenido exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al obtener pedido
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedidoId = Number(id);

    if (isNaN(pedidoId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const pedido = await PedidoService.obtenerPorId(pedidoId);
    return NextResponse.json(pedido, { status: 200 });

  } catch (error: any) {
    console.log('Error al obtener pedido:', error);

    if (error.message === 'El pedido no existe') {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error al obtener pedido' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Actualiza un pedido existente (ej. su estado o datos)
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *               estado_pago:
 *                 type: string
 *               direccion_entrega:
 *                 type: string
 *               condicion_venta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: El pedido a modificar no existe
 *       500:
 *         description: Error interno del servidor
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const pedidoId = Number(id);

    const pedidoActualizado = await PedidoService.actualizar(pedidoId, body);

    return NextResponse.json(pedidoActualizado, { status: 200 });

  } catch (error: any) {
    console.log('Error al actualizar pedido:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Datos inválidos',
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    if (error.message === 'El pedido a modificar no existe') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Cancela/Elimina un pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a cancelar
 *     responses:
 *       200:
 *         description: Pedido cancelado correctamente
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error al eliminar cliente
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedidoId = Number(id);

    await PedidoService.eliminar(pedidoId);

    return NextResponse.json({ success: true, message: 'Pedido cancelado correctamente' }, { status: 200 });

  } catch (error: any) {
    console.log('Error al cancelar pedido:', error);

    if (error.message === 'ID invalido') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 });
  }
}