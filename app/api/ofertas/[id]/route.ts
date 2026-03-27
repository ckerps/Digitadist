import { NextRequest, NextResponse } from "next/server";
import { OfertaService } from "@/services/oferta.service";
import { ActualizarOfertaSchema, RenovarOfertaSchema } from "@/repositories/zodSchemas";
import { z } from "zod";

/**
 * GET /api/ofertas/[id]
 * Obtiene una oferta por ID
 */

export async function GET(
  _request: NextRequest, // Agregado para mantener consistencia
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ofertaId = Number(id);

    if (isNaN(ofertaId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const oferta = await OfertaService.obtenerPorId(ofertaId);
    return NextResponse.json(oferta, { status: 200 });

  } catch (error: any) {
    console.error('Error al obtener oferta:', error);

    if (error.message === 'OFERTA_NOT_FOUND') {
      return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error al obtener oferta' }, { status: 500 });
  }
}

/**
 * PUT /api/ofertas/[id]
 * Actualiza una oferta existente
 */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const ofertaId = Number(id);

    const ofertaActualizada = await OfertaService.actualizar(ofertaId, body);

    return NextResponse.json(ofertaActualizada, { status: 200 });

  } catch (error: any) {
    console.error('Error al actualizar oferta:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Datos inválidos', 
        details: error.flatten().fieldErrors 
      }, { status: 400 });
    }

    if (error.message === 'Oferta no encontrado') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

/**
 * DELETE /api/ofertas/[id]
 * Elimina (desactiva) una oferta
 */

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ofertaId = Number(id);

    await OfertaService.eliminar(ofertaId);

    return NextResponse.json({ success: true, message: 'Oferta eliminado correctamente' }, { status: 200 });

  } catch (error: any) {
    console.error('Error al eliminar oferta:', error);

    if (error.message === 'Oferta no encontrado') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al eliminar oferta' }, { status: 500 });
  }
}