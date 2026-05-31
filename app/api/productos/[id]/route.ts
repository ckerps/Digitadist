import { ClienteService } from '@/services/cliente.service'
import { ProductoService } from '@/services/producto.service';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as z from 'zod';

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a obtener
 *     responses:
 *       200:
 *         description: Producto obtenido exitosamente
 *       400:
 *         description: ID inválido o producto no existe
 *       500:
 *         description: Error interno del servidor
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productoId = Number(id);

    if (isNaN(productoId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const producto = await ProductoService.obtenerPorId(productoId);
    return NextResponse.json(producto, { status: 200 });

  } catch (error: any) {
    console.log('Error al obtener producto:', error);

    if (error.message === "El producto no existe") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               SKU:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precioBase:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoriaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: El producto a modificar no existe
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
    const productoId = Number(id);

    // Obtener la sesión para obtener el usuarioId
    const session = await getServerSession(authOptions);
    const usuarioId = session?.user ? Number((session.user as any).id) : undefined;

    const productoActualizado = await ProductoService.actualizar(productoId, body, usuarioId);

    return NextResponse.json(productoActualizado, { status: 200 });

  } catch (error: any) {
    console.log('Error al actualizar producto:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Datos inválidos',
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    if (error.message === 'El producto a modificar no existe') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Elimina (desactiva) un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a eliminar/desactivar
 *     responses:
 *       200:
 *         description: Producto desactivado correctamente
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error al eliminar producto
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productoId = Number(id);

    await ProductoService.eliminar(productoId);

    return NextResponse.json({ success: true, message: 'Producto desactivado correctamente' }, { status: 200 });

  } catch (error: any) {
    console.log('Error al eliminar producto:', error);

    if (error.message === 'ID inválido') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 });
  }
}