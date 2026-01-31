import { ClienteService } from '@/services/cliente.service'
import { NuevoCliente } from '@/types/cliente'
import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod';


/**
 * GET /api/clientes
 * Obtiene todos los clientes
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const itemsPerPage = parseInt(url.searchParams.get('items') || '10');
    const currentPage = parseInt(url.searchParams.get('page') || '1');

    const clientes = await ClienteService.obtenerTodos(itemsPerPage, currentPage)
    return NextResponse.json(clientes, { status: 200 })
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
 * POST /api/clientes
 * Crea un nuevo cliente
 */
// app/api/clientes/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resultado = await ClienteService.crear(body);
    
    return NextResponse.json(resultado, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        type: "ValidationError", 
        details: error.flatten().fieldErrors 
      }, { status: 400 });
    }

    if (error.message === "Ya existe un cliente con ese CUIT") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
