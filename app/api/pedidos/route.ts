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
    const itemsPerPage = parseInt(url.searchParams.get('items') || '10');
    const currentPage = parseInt(url.searchParams.get('page') || '1');
    const filters : Partial<{ [key: string]: string }> = {};
      url.searchParams.forEach((value, key) => {
        if (key !== 'itemsPerPage' && key !== 'currentPage') {
          filters[key] = value;
        }
    });

    const pedidos = await PedidoService.obtenerTodos(itemsPerPage, currentPage, filters)
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
