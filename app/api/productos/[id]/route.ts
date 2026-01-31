import { ClienteService } from '@/services/cliente.service'
import { ProductoService } from '@/services/producto.service';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

/**
 * GET /api/productos/[id]
 * Obtiene un cliente por ID
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
    console.error('Error al obtener producto:', error);

    if (error.message === "El producto no existe") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 });
  }
}

/**
 * PUT /api/productos/[id]
 * Actualiza un producto existente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const productoId = Number(id);

    const productoActualizado = await ProductoService.actualizar(productoId, body);

    return NextResponse.json(productoActualizado, { status: 200 });

  } catch (error: any) {
    console.error('Error al actualizar producto:', error);
    
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
 * DELETE /api/productos/[id]
 * Elimina (desactiva) un producto
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
    console.error('Error al eliminar producto:', error);

    if (error.message === 'ID inválido') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 });
  }
}