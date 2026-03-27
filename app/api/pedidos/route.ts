import { PedidoService } from '@/services/pedido.service';
import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod';


/**
 * GET /api/pedidos
 * Obtiene todos los pedidos
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const itemsPerPage = parseInt(url.searchParams.get('itemsPerPage') || '10');
    const currentPage = parseInt(url.searchParams.get('currentPage') || '1');

    // Extraer filtros de los query params
    const filtros: any = {};
    if (url.searchParams.has('searchTerm')) filtros.searchTerm = url.searchParams.get('searchTerm');
    if (url.searchParams.has('cliente_id')) filtros.cliente_id = parseInt(url.searchParams.get('cliente_id') || '0');
    if (url.searchParams.has('vendedor_id')) filtros.vendedor_id = parseInt(url.searchParams.get('vendedor_id') || '0');
    if (url.searchParams.has('estado')) filtros.estado = url.searchParams.get('estado');
    if (url.searchParams.has('estado_pago')) filtros.estado_pago = url.searchParams.get('estado_pago');
    if (url.searchParams.has('direccion_entrega')) filtros.direccion_entrega = url.searchParams.get('direccion_entrega');
    if (url.searchParams.has('condicion_venta')) filtros.condicion_venta = url.searchParams.get('condicion_venta');

    const pedidos = await PedidoService.obtenerTodos(itemsPerPage, currentPage, Object.keys(filtros).length > 0 ? filtros : undefined)
    return NextResponse.json(pedidos, { status: 200 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        type: "ValidationError",
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/pedidos
 * Crea un nuevo pedido
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body)
    const resultado = await PedidoService.crear(body?.pedido, body?.detalle);

    return NextResponse.json(resultado, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        type: "ValidationError",
        details: error.flatten().fieldErrors
      }, { status: 400 });
    }

    if (error.message === "El pedido debe tener al menos un producto") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
