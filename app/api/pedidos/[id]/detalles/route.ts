import { PedidoService } from '@/services/pedido.service';
import { NextRequest, NextResponse } from 'next/server';
import { NuevoDetallePedidoSchema } from '@/repositories/zodSchemas';

/**
 * POST /api/pedidos/[id]/detalles
 * Agrega un nuevo producto al pedido existente
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
    console.error('Error al agregar producto al pedido:', error);

    if (error.message?.includes('no existe')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al agregar producto al pedido' }, { status: 500 });
  }
}
