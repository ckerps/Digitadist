import { UsuarioService } from '@/services/usuario.service';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

/**
 * GET /api/usuarios/[id]
 * Obtiene un usuario por ID
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
    console.error('Error al obtener usuario:', error);

    if (error.message === "El usuario no existe") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 });
  }
}

/**
 * PUT /api/usuarios/[id]
 * Actualiza un usuario existente
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
    console.error('Error al actualizar usuario:', error);
    
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
 * DELETE /api/usuarios/[id]
 * Elimina (desactiva) un usuario
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
    console.error('Error al desactivar usuario:', error);

    if (error.message === 'ID inválido') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error al desactivar usuario' }, { status: 500 });
  }
}