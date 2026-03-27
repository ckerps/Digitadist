import { NextRequest, NextResponse } from "next/server";
import { OfertaService } from "@/services/oferta.service";
import { NuevaOfertaSchema, PaginacionSchema, FiltrosOfertaSchema } from "@/repositories/zodSchemas";
import { z } from "zod";

/**
 * GET /api/ofertas
 * Obtiene ofertas paginadas
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

    const ofertas = await OfertaService.obtenerTodos(itemsPerPage, currentPage, filters)
    return NextResponse.json(ofertas, { status: 200 })
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
 * POST /api/ofertas
 * Crea una nueva oferta
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resultado = await OfertaService.crear(body);
    
    return NextResponse.json(resultado, { status: 201 });
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
