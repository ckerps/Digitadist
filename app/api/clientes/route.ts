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
    const itemsPerPage = parseInt(url.searchParams.get('itemsPerPage') || '10');
    const currentPage = parseInt(url.searchParams.get('currentPage') || '1');

    // Extraer filtros de los query params
    const filtros: any = {};
    if (url.searchParams.has('id')) filtros.id = parseInt(url.searchParams.get('id') || '0');
    if (url.searchParams.has('nombre')) filtros.nombre = url.searchParams.get('nombre');
    if (url.searchParams.has('telefono')) filtros.telefono = url.searchParams.get('telefono');
    if (url.searchParams.has('cuit')) filtros.cuit = url.searchParams.get('cuit');
    if (url.searchParams.has('tipo')) filtros.tipo = url.searchParams.get('tipo');
    if (url.searchParams.has('email')) filtros.email = url.searchParams.get('email');
    if (url.searchParams.has('activo')) filtros.activo = url.searchParams.get('activo') === 'true';
    if (url.searchParams.has('searchTerm')) filtros.searchTerm = url.searchParams.get('searchTerm');

    const clientes = await ClienteService.obtenerTodos(itemsPerPage, currentPage, Object.keys(filtros).length > 0 ? filtros : undefined)
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
    console.error('Error creating cliente:', error);
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
