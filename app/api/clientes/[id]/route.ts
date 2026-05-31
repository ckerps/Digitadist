import { ClienteService } from '@/services/cliente.service'
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtiene un cliente por ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a obtener
 *     responses:
 *       200:
 *         description: Cliente obtenido exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error al obtener cliente
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clienteId = Number(id);

    if (isNaN(clienteId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const cliente = await ClienteService.obtenerPorId(clienteId);
    return NextResponse.json(cliente, { status: 200 });

  } catch (error: any) {
    console.log('Error al obtener cliente:', error);

    if (error.message === 'CLIENTE_NOT_FOUND') {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualiza un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               cuit:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               direccion:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliente no encontrado
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
    const clienteId = Number(id);

    const clienteActualizado = await ClienteService.actualizar(clienteId, body);

    return NextResponse.json(clienteActualizado, { status: 200 });

  } catch (error: any) {
    console.log('Error al actualizar cliente:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Datos inválidos',
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    if (error.message === 'Cliente no encontrado') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Elimina (desactiva) un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a eliminar
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error al eliminar cliente
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clienteId = Number(id);

    await ClienteService.eliminar(clienteId);

    return NextResponse.json({ success: true, message: 'Cliente eliminado correctamente' }, { status: 200 });

  } catch (error: any) {
    console.log('Error al eliminar cliente:', error);

    if (error.message === 'Cliente no encontrado') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 });
  }
}