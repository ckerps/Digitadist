import { UsuarioService } from '@/services/usuario.service';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a obtener
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *       400:
 *         description: ID inválido o usuario no existe
 *       505:
 *         description: Error al obtener usuario
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioId = Number(id);

    if (isNaN(usuarioId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const usuario = await UsuarioService.obtenerPorId(usuarioId);
    return NextResponse.json(usuario, { status: 200 });

  } catch (error: any) {
    console.log('Error al obtener usuario:', error);

    if (error.message === "El usuario no existe") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               rol:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: El usuario a modificar no existe
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
    const usuarioId = Number(id);

    const usuarioActualizado = await UsuarioService.actualizar(usuarioId, body);

    return NextResponse.json(usuarioActualizado, { status: 200 });

  } catch (error: any) {
    console.log('Error al actualizar usuario:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Datos inválidos',
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    if (error.message === 'El usuario a modificar no existe') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina (desactiva) un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a desactivar
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error al desactivar usuario
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const usuarioId = Number(id);

    await UsuarioService.eliminar(usuarioId);

    return NextResponse.json({ success: true, message: 'Usuario desactivado correctamente' }, { status: 200 });

  } catch (error: any) {
    console.log('Error al desactivar usuario:', error);

    if (error.message === 'ID inválido') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error al desactivar usuario' }, { status: 500 });
  }
}