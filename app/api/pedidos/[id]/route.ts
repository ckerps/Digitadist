import { PedidoService } from '@/services/pedido.service';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

/**
 * GET /api/pedidos/[id]
 * Obtiene un pedido por ID
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
    console.error('Error al obtener pedido:', error);

    if (error.message === 'El pedido no existe') {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error al obtener pedido' }, { status: 500 });
  }
}

/**
 * PUT /api/pedidos/[id]
 * Actualiza un pedido existente
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
    console.error('Error al actualizar pedido:', error);
    
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
 * DELETE /api/pedidos/[id]
 * Cancela un pedido
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
    console.error('Error al cancelar pedido:', error);

    if (error.message === 'ID invalido') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error al eliminar cliente' }, { status: 500 });
  }
}